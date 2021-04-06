Main View
========

Module `/src/views/MainView.js` manages **PoLZy** views for the authenticated users. The module defines:
- [flags](#view-flags) for the available views
- component [RenderView](#renderview) (internal), which maps the flags to the available views
- componnet [MainView](#mainview) (default export), which manages the views, the header, the footer and the toasts (alerts)


View Flags
---------------

**PoLZy** uses a set of string flags to define which a view is rendered currently. All the flags could be _imported_ in another modules.
``` javascript
import { VIEW_HOME, VIEW_ADMIN, VIEW_BADGE, VIEW_RANKING } from '../views/MainView'
```
The table below shows the list of the flags. 

| Name         | Type     | Value     | Corresponded View            |
| ------------ | -------- | --------- | ---------------------------- |
| VIEW_HOME    | `string` | "home"    | [HomeView](#TODO:setlink)    |
| VIEW_ADMIN   | `string` | "admin"   | [AdminView](#TODO:setlink)   |
| VIEW_BADGE   | `string` | "badge"   | [BadgeView](#TODO:setlink)   |
| VIEW_RANKING | `string` | "ranking" | [RankingView](#TODO:setlink) |


RenderView
-----------------
It is a mapper component that accepts available view props and returns a specific view by matching prop `view` with [view flags](#view-flags).

#### Props
| Name | Type     | Description              |
| ---- | -------- | ------------------------ |
| view | `string` | The flag of a view (see [View Flags](#view-flags) for possible values). |
| tab | `string` | _Optional_ prop that defines a tab to render on [Home View](#TODO:setlink). |
| updateBadge | `bool` | Shows if badge info is updating currently. |
| onClose | `func` | Callback fired when view is closed. |
| onChange | `func` | Callback fired when view is changed. |
| onBadgesUpdated | `func` | Callback fired when user badge status was updated. |


#### Implementation
Renders one of the views listed in the table from section [View Flags](#view-flags) by matching prop `view` with possible view flags. If `view` does not match any flag then the component renders _default_ [HomeView](#TODO:setlink).

MainView
--------------
This component renders the current view using [RenderView](#renderview), defines logic for transition between views and provides alerts for **_PoLZy_** the system.

#### Props
| Name     | Type     | Description                                                  |
| -------- | -------- | ------------------------------------------------------------ |
| user     | `object` | Object that contains user credentials. |

#### State
| Name | Type     | Default       | Description              |
| ---- | -------- | ------------------------ | ------------------------ |
| view | `string` | `VIEW_HOME` | The [flag](#view-flags) of the current view. |
| updateBadge | `bool` | `true` | Boolean flag that shows if badge info is updating currently. |

#### Callbacks
| Name | Description              |
| ---- | ------------------------ |
| goToHome | **_Fired_** when exiting any view.<br/>**_Implementation_**: sets the view flag to `VIEW_HOME`. |
| closeToastAction | **_Fired_** when closing a toast (alert).<br/>**_Accepts_** `key` of a toast snackbar component.<br/>**_Implementation_**: closes the requested toast snackbar. |
| handleOnBadgesUpdated | **_Fired_** when received data on user's badges from the back-end.<br/>**_Implementation_**: sets state `updateBadge` to `false`. |

#### Implementation
When the component is mounted, it sets up the toast system which comprises two elements:

1) Periodically (by default, once per minute) requests the back-end ([pushNotifications](#TODO:setlink)) for pushing system messages.

2) Defines event listener which constantly monitors `/api/listen` route on back-end. If event occurs, the event listener pushes either a toast that signals about achieving a new badge (event `newbadge`) or a regular text toast (event `message`).

The component renders view application bar of **PoLZy**, current view and footer.

