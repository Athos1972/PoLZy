Policy View
========

Module `/src/views/PolicyView.js` manages the rendering of the policy instances and connect them to [Sentry](#TODO:setlink). The module defines two components:

- [RenderPolicyCard](#renderpolicycard) (internal), which maps the policy card component  to the current policy state
- [PolicyView](#policyview) (default export), which manages the views, the header, the footer and the toasts (alerts)


RenderPolicyCard
--------------------------

It is a mapper component that renders a specific type of [policy card](#TODO:setlink) by the policy request status.

#### Props

| Name   | Type     | Description                                   |
| ------ | -------- | --------------------------------------------- |
| index  | `number` | The index of the policy in the _redux_ store. |
| policy | `object` | The policy instance.                          |


#### Implementation

Renders one of the policy cards depending on the value of prop `policy.request_state`. Table below shows the mapping options.

| Value of `policy.request_state` | Policy Card Component         |
| ------------------------------- | ----------------------------- |
| "ok"                            | [ActivePolicy](#TODO:setlink) |
| "waiting"                       | [DisabledPolicy](#TODO:setlink) |
| "customer"                      | [Customer](#TODO:setlink) |
| "error" (or any other value)    | [ErrorPolicy](#TODO:setlink) |



PolicyView
--------------

This component renders policy creation card and all the policy cards stored in the _redux_ store. Additionally, it sets [Sentry](#TODO:setlink) error boundaries for each card to track possible errors.

#### Props

| Name     | Type     | Description                                 |
| -------- | -------- | ------------------------------------------- |
| user     | `object` | Object that contains user credentials.      |
| policies | `array`  | Array that holds all loaded policy objects. |


#### Implementation

This component renders policy creation card and the policy cards from prop `policies` wrapped in the  [Sentry](#TODO:addlink) error boundaries.