Home View
=========

Module `/src/views/HomeView.js` renders the  main action views of **PoLZy**, that the current user is allowed to access.

The possible action views are:

- Policy (name = "_policy_")
- Fast Offer (name= "_antrag_")

The module defines:
- component [RenderTabView](#rendertabview) (internal), which maps view name to the available action views
- componnet [HomeView](#homeview) (default export), which manages the action views


RenderTabView
-----------------------

It is a mapper component that renders a specific action view by its name.

#### Props

| Name | Type     | Description                                                  |
| ---- | -------- | ------------------------------------------------------------ |
| view | `string` | The name of an action view. The possible names of the action views are listed in the [main section](#home-view) |


#### Implementation

Renders one of the action views listed in the [main section](#home-view) by matching prop `view` with possible view names. If `view` does not match any name (or is empty) then the component renders [NotAllowedView](#TODO:setlink).

HomeView
----------------

This component renders a tab panel (if user is allowed to access multiple action views) and a currently selected action view. If the user is not allowed to see any action view, then the component renders [NotAllowedView](#TODO:setlink).

#### Props

| Name      | Type     | Description                                                  |
| --------- | -------- | ------------------------------------------------------------ |
| tab       | `string` | The name of the predefined action view. Used if user is trying to access a record on a specific view by an external link. |
| user      | `object` | Object that contains user credentials and permissions. |
| addAntrag | `func`   | Callback that generates _redux_ action to add an antrag (product offer) instance to the store. Fired when user is accessing **PoLZy** by external link on a product offer. |

#### State

| Name         | Type     | Default     | Description                                   |
| ------------ | -------- | ----------- | --------------------------------------------- |
| tab          | `string` | `umdefined` | The name of the current action view.          |
| allowedViews | `array`  | `[]`        | A list of allowed to the _user_ action views. |


#### Implementation

When the component is mounted, it performs the following actions:
- updates state _allowedViews_ from prop _user.permissions_ (if user's permissions will be changed during the session, the component update state _allowedViews_ again)
- checks if user is trying to access a specific product offer by a link. If so, the component fetches the product offer from the back-end and stores it to the _redux_ store

The component renders a tab panel (if user is allowed to access multiple action views) and an action view by state `tab`.  If user is not allowed to see any action view, then the component renders [NotAllowedView](#TODO:setlink).
