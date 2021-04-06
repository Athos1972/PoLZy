Antrag View
========

Module `/src/views/AntragView.js` manages the rendering of the product offer instances and connect them to [Sentry](#TODO:setlink). The module defines two components:

- [RenderAntragCard](#renderantragcard) (internal), which maps the policy card component  to the current policy state
- [AntragView](#antragview) (default export), which manages the views, the header, the footer and the toasts (alerts)


RenderAntragCard
----------------------------

It is a mapper component that renders a specific type of [product offer card](#TODO:setlink) by the  request status.

#### Props

| Name   | Type     | Description                                   |
| ------ | -------- | --------------------------------------------- |
| scrollTop  | `number` | The vertical `x` coordinate of the top of the current window. |
| index  | `number` | The index of the product offer in the _redux_ store. |
| antrag | `object` | The product offer instance. |


#### Implementation

Renders one of the product offer cards depending on the value of prop `antrag.request_state`. Table below shows the mapping options.

| Value of `antrag.request_state` | Product Offer Card Component |
| ------------------------------- | ----------------------------- |
| "ok"                            | [ActiveAntrag](#TODO:setlink) |
| "waiting"                       | [DisabledAntrag](#TODO:setlink) |
| "error" (or any other value)    | [ErrorAntrag](#TODO:setlink) |



AntragView
--------------

This component renders offer creation card and all the product offer cards stored in the _redux_ store. Additionally, it sets [Sentry](#TODO:setlink) error boundaries for each card to track possible errors.

#### Props

| Name    | Type     | Description                                  |
| ------- | -------- | -------------------------------------------- |
| user    | `object` | Object that contains user credentials.       |
| antrags | `array`  | Array that holds all created product offers. |

#### State

| Name      | Type     | Default | Description                                                  |
| --------- | -------- | ------- | ------------------------------------------------------------ |
| scrollTop | `number` | 0       | The vertical `x` coordinate of the top of the current window. |

#### Implementation

This component renders offer creation card and the product offer cards from prop `antrags` wrapped in the  [Sentry](#TODO:addlink) error boundaries.
Additionally, the component tracks the current vertical scrolling position of the window	and send it down to the product offer cards.