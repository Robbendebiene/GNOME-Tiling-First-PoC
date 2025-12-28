function main() {
  document.documentElement.classList.add('overview');
  for (const app of document.querySelectorAll('.app')) {
    app.onpointerup = onAppPointerup;
  }
  const indicator = document.getElementById('indicator');
  indicator.onclick = onWorkspaceIndicatorClick;
  indicator.onwheel = onWorkspaceScroll;

  const workspaces = document.getElementById('workspaces');
  workspaces.onwheel = onWorkspaceOverviewScroll;
  // required to fire drop event
  workspaces.ondragover = e => e.preventDefault();
  workspaces.ondrop = onWorkspaceOutsideDrop;

  window.addEventListener(
    'pointerdown',
    () => document.documentElement.requestFullscreen(),
    { once: true }
  );
}
window.addEventListener('DOMContentLoaded', main);

let draggedElement = null;
window.addEventListener('dragstart', e =>  draggedElement = e.target);
window.addEventListener('dragend', e => draggedElement = null);

// MAIN EVENT HANDLER FUNCTIONS \\

function onWorkspaceIndicatorClick(event) {
  document.documentElement.classList.toggle('overview');
}

function onWorkspaceOverviewScroll(event) {
  if (document.documentElement.classList.contains('overview')) {
    onWorkspaceScroll(event);
  }
}

function onWorkspaceScroll(event) {
  event.preventDefault();
  const workspace = getActiveWorkspace();
  if (!workspace) return;
  if (event.deltaY > 0) {
    const nextWorkspace = workspace.nextElementSibling;
    if (nextWorkspace) setActiveWorkspace(nextWorkspace);
  }
  else if (event.deltaY < 0) {
    const previousWorkspace = workspace.previousElementSibling;
    if (previousWorkspace) setActiveWorkspace(previousWorkspace);
  }
}

function onAppPointerup(event) {
  const iconSrc = this.querySelector('img').src;
  const window = newWindow(iconSrc);

  if (event.button === 0 && event.ctrlKey || event.button === 1) {
    const workspace = newWorkspace();
    addWindowToWorkspace(window, workspace);
    addWorkspace(workspace);
  }
  else if (event.button === 0) {
    const workspaces = getAllWorkspaces();
    let workspace;

    if (workspaces.length > 0) {
      workspace = getActiveWorkspace();
    }
    else {
      workspace = newWorkspace();
      addWorkspace(workspace);
    }
    addWindowToWorkspace(window, workspace);
    document.documentElement.classList.remove('overview');
  }
}

function onWorkspaceOutsideDrop(event) {
  event.preventDefault;

  let window;
  if (draggedElement.matches('.window')) {
    removeWindowFromWorkspace(draggedElement);
    window = draggedElement;
  }
  else if (draggedElement.matches('.app img')) {
    window = newWindow(draggedElement.src);
  }
  else {
    return;
  }

  const workspace = newWorkspace();
  addWindowToWorkspace(window, workspace);

  const nextWorkspace = getAllWorkspaces().find((w) => {
    const bbox = w.getBoundingClientRect();
    return event.clientX < bbox.x + bbox.width/2;
  });

  if (nextWorkspace) {
    nextWorkspace.before(workspace);
    setActiveWorkspace(workspace);
  }
  else {
    addWorkspace(workspace);
  }
}

function onWorkspaceInsideDrop(event) {
  event.preventDefault;
  event.stopPropagation();
  if (this.contains(draggedElement)) return;
  if (draggedElement.matches('.window')) {
    removeWindowFromWorkspace(draggedElement);
    addWindowToWorkspace(draggedElement, this);
  }
  else if (draggedElement.matches('.app img')) {
    const window = newWindow(draggedElement.src);
    addWindowToWorkspace(window, this);
  }
}

function onWindowClick() {
  if (document.documentElement.classList.contains('overview')) {
    document.documentElement.classList.remove('overview');
    const workspace = getWorkspaceOfWindow(this);
    setActiveWorkspace(workspace);
  }
}

function onCloseWindowClick(e) {
  removeWindowFromWorkspace(this);
  e.stopPropagation();
}

// WORKSPACE FUNCTIONS \\

function newWorkspace() {
  const workspace = document.createElement('div');
        workspace.classList.add('workspace');
        // required to fire drop event
        workspace.ondragover = e => e.preventDefault();
        workspace.ondrop = onWorkspaceInsideDrop;
  return workspace;
}

function addWorkspace(workspace) {
  const workspaces = document.querySelector('#workspaces > .wrapper');
        workspaces.append(workspace);
  setActiveWorkspace(workspace);
}

function removeWorkspace(workspace) {
  const activeWorkspaceIndex = getActiveWorkspaceIndex();
  const removedWorkspaceIndex = getAllWorkspaces().indexOf(workspace);
  if (removedWorkspaceIndex <= activeWorkspaceIndex) {
    setActiveWorkspaceIndex(activeWorkspaceIndex - 1);
  }

  workspace.animate([
    {
      width: '0',
      marginLeft: 'calc(-1 * var(--workspaceGap))'
    },
  ], {
    duration: 300,
    easing: 'ease',
  }).finished.then(() => workspace.remove());
}

function getAllWorkspaces() {
  return Array.from(document.querySelectorAll('#workspaces .workspace'));
}

function getWorkspaceOfWindow(window) {
  return window.closest('.workspace');
}

function getActiveWorkspaceIndex() {
  const workspaceIndexValue = document.documentElement.style.getPropertyValue('--activeWorkspaceIndex');
  return workspaceIndexValue !== ''
    ? Number(workspaceIndexValue)
    : -1;
}

function getActiveWorkspace() {
  const workspaceIndex = getActiveWorkspaceIndex();
  if (workspaceIndex !== -1) {
    const workspaces = getAllWorkspaces();
    return workspaces[workspaceIndex];
  }
}

function setActiveWorkspaceIndex(index) {
  document.documentElement.style.setProperty('--activeWorkspaceIndex', Math.max(index, 0));
}

function setActiveWorkspace(workspace) {
  const workspaces = getAllWorkspaces();
  const index = workspaces.indexOf(workspace);
  setActiveWorkspaceIndex(index);
}

// WINDOW FUNCTIONS \\

function newWindow(iconUrl) {
  const window = document.createElement('div');
        window.classList.add('window');
        window.draggable="true";
        window.onclick=onWindowClick;
  const icon = document.createElement('img');
        icon.src = iconUrl;
        icon.classList.add('icon');
  const close = document.createElement('button');
        close.onclick = onCloseWindowClick.bind(window);
        close.textContent = '✕';
        close.classList.add('close');
  window.append(icon, close);
  return window;
}

// move or add
function addWindowToWorkspace(window, workspace) {
  const windowCount = workspace.children.length;
  if (windowCount === 3) {
    workspace.children[0].after(window);
  }
  else {
    workspace.append(window);
  }
}

function removeWindowFromWorkspace(window) {
  const workspace = getWorkspaceOfWindow(window);
  window.remove();
  if (!workspace.firstElementChild) {
    removeWorkspace(workspace);
  }
}
