Product Offer Cards
=================

A product offer card could be in one of the following states:
- disabled (while initilizing the offer and requesting data from the back-end for the first time )
- active (if the offer object was successfully initialized)
- error (if any error occures while processing the offer data)

Active Offer Card
-------------------------
The Active Offer Card is defined in module `src/antrag.active.js`. It provides the details of a speciffic offer and allows executing all the possible activities for the current state.
There two components in the module:
- [CustomTagBase](#customtagbase) is a base component (subject of connection with the _redux_) that renders a custom tag of a product offer and provides functionality to keep the custom tag synchronized with the back-end,
- [ActiveAntrag](#activeantrag) renders the product offer card and provides all possible functionality related to the current product offer.

CustomTagBase
-----------------------
It is a base component (subject of connection with the _redux_) that renders a custom tag of a product offer and provides functionality to keep the custom tag synchronized with the back-end. It could be in one of _view_ and _edit_ mode (details in section [implementation](#implementation)).

#### Props
| Name   | Type     | Description                                   |
| ------ | -------- | --------------------------------------------- |
| index  | `number` | The index of the product offer in the _redux_ store. |
| id  | `string` | The ID of the current product offer. |
| text  | `string` | The current text (value) of the custom tag obtained from the back-end. |
| user | `object` | Object that contains the user credentials. |
| updateAntrag | `func` | _Redux_ action that updates product offer instance in the store. |

#### State
| Name      | Type     | Default | Description                   |
| --------- | -------- | ------- | ----------------------------- |
| textValue | `string` | ''      | The current text (value) of the custom tag in edit mode. |

#### Callbacks
| Name | Description              |
| ---- | ------------------------ |
| updateTag | **_Fired_** when a new tag was successfully updated on the back-end.<br/>**_Accepts_** the text of the new tag.<br/>**_Implementation_**: calls _updateAntrag_ callback to save the new tag in the product offer instance that in the _redux_ store. |
| handleValueChange | **_Fired_** when user changes (types) the text of the custom tag in edit mode.<br/>**_Implementation_**: sets text entered into the tag input field in edit mode to state `textValue`. |
| handleTagChange | **_Fired_** when the user clicks _save_ button in the tag edit mode.<br/>**_Implementation_**: calls back-end (_[setCustomTag](#TODO:setlink)_) to synchronize the custom tag that entered in the edit mode. |
| handleTagDelete | **_Fired_** when the user clicks _delete_ button of the tag chip in the view mode.<br/>**_Implementation_**: calls back-end (_[setCustomTag](#TODO:setlink)_) to synchronize the custom tag with empty string. |

#### Implementation

The component could either in _view_ or _edit_ mode. The current mode depends on prop `text`.
If prop `text` is not the empty string then the component is in the _view_ mode. It  renders a chip that contains the text of the tag.
In the _edit_ the component renders an input text field and a _save_ button.


ActiveAntrag
-------------------

#### Props
| Name   | Type     | Description                                   |
| ------ | -------- | --------------------------------------------- |
| scrollTop  | `number` | The vertical `x` coordinate of the top of the current window. |
| index  | `number` | The index of the product offer in the _redux_ store. |
| antrag | `object` | The product offer instance. |
| user | `object` | Object that contains the user credentials. |
| valueLists | `object` | Object that contains _value lists_ stored in the _redux_. |
| updateAntrag | `func` | _Redux_ action thet updates product offer instance in the store. |
| newAntrag | `func` | _Redux_ action that adds a new product offer instance to the store. |
| closeAntrag | `func` | _Redux_ action that removes a product offer instance from the store. |
| clearAddressList | `func` | _Redux_ action that removes from the store the address list associated with the current product offer. |

#### State
| Name      | Type   | Default | Description                   |
| --------- | ------ | ------- | ----------------------------- |
| isVisible | `bool` | `false` | Shows if the card is visible. Used for appear and delete animations. |
| autoCalculateDisabled | `bool` | `false` | Shows if the autocalculation of the current product offer should be disabled. |
| openUploadDialog | `bool` | `false` | Shows if a file upload dialog is visible. |
| openSpeedometer | `bool` | `false` | Shows if a _speedometer_, that indicates the overall score of the current product offer, is visible. |
| speedometerIsSticky | `bool` | `false` | Shows if a _speedometer_, that indicates the overall score of the current product offer, should be _sticked_ to the card layout (used for small screens) |
