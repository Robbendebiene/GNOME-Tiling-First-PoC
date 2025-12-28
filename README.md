# What is this?

Over the holidays something sparked my motivation for making GNOME a tiling first window manager. I re-visited different resources like the [Forge extension](https://github.com/forge-ext/forge) and the blog post [Rethinking Window Management](https://blogs.gnome.org/tbernard/2023/07/26/rethinking-window-management/) and decided to give it a shot. The result is a tiny web app serving as a proof of concept to get a better feeling of the idea which was heavily inspired by the [mockups](https://gitlab.gnome.org/Teams/Design/os-mockups/-/tree/master/mobile-shell/tiling) of @bertob.

https://github.com/user-attachments/assets/8690ad36-dad7-4f73-95b4-eefd989fd689

## Working principle

- Clicking an app opens and tiles it in the current workspace and focuses the current workspaces
- Dragging an app onto a workspace opens and tiles it on that workspace
- There are no empty workspaces, in order to create a new workspace:
    - Middle click an app
    - Drag & drop an app onto the workspace area
    - Drag & drop an already opened window onto the workspace area

## The Overview is great, don't remove it!
I totally agree. For me it is one of the best features of GNOME. Let's look at the main use cases of the overview:
- launching a new app
- switching (stacked) apps
- closing app
- workspace stuff

In a tiling first shell "switching (stacked) apps" is no longer necessary, which is the main purpose of the "exploded windows" overview. This is why we can merge the currently separated *app grid* and *overview* into one single overview. What becomes important now is an overview of our workspaces.

## Removing the Dash is a bad idea!
Perhaps it is. I only use it to launch a few favourite apps which is still possible with the new concept. What is lost is the visibility of opened apps and the ability to switch between them, both things can be accomplished in many other ways. I personally never use it for switching windows, but it might be deeply embedded in the workflow of other users.

## Unanswered questions

What should be the primary action when clicking an app? Should it be opened on the current workspace and tile? Should it be opened on a new workspace? Should the respective workspace be focused immediately?

### What happens if an app ...
- ... launches multiple windows?
- ... cannot be "shrunk" to a tile?
- ... takes time to start? (perhaps a placeholder window could appear?)

## What now?
This proof of concept could be improved endlessly. Like fixing bugs or mimicking more functionality (PRs always welcome). However I think for now it is good enough to discuss and iterate on the core idea (or dump it entirely). So lets critique the hell out of this concept in the discussions 😁
