Icons
=====
**PoLZy** uses _SVG_  icons to display:
- list of the offered products ([Product Icons](#product-icons))
- activity buttons for the offered products ([Activity Icons](#activity-icons))
The icons are defined on back-end and could be customized in a specific implementation.
Both the icon components are defined in module `/src/components/icons.js`.

Icon Collection
----------------------
**PoLZy** contains a default  collection of the icons in  folder `/src/icons`.

Product Icons
--------------------
_Product Icons_ are utilized to render the offered products within the list of the available products.

#### Component Name
ProductIcon

#### Props
| Name | Type     | Predefined Values | Description              |
| ---- | -------- | :------ | ------------------------ |
| icon | `string` | `car_filled.svg`,  `house_filled.svg`,  `document_filled.svg`,  `forest_filled.svg` | The filename of an icon |

#### Implementation
The component renders an icon from `/src/icon` based on the filename defined in _icon_ prop. If _icon_ value does not match any predefined value then the default icon `handshake_filled.svg` will be rendered.

#### Customization
You may add your own icons by performing the following steps:
1. Add an _SVG_ icon to icon collection at `/src/icons`
2. import the new icon in module `/src/components/icons.js`:
```javascript
import myNewIcon from '../icons/myNewIcon.svg'
```
3. Add the corresponding _switch case_ to _getIcon_ const:
```javascript
const getIcon = () => {
  switch (props.icon) {
    case "myNewIcon.svg":
      return myNewIcon
    ...
  }
}
```

Activity Icons
-------------------
_Activity Icons_ are used to render the activity buttons on the cards of the offered products..

#### Component Name
ActivityIcon

#### Props
| Name | Type     | Predefined Values | Description              |
| ---- | -------- | :------ | ------------------------ |
| icon | `string` | `calculate.svg`, `pdf.svg`, `partnersearch.svg`, `saveToVNG.svg`, `iconSaveRecommendation.svg`, `iconSearchEurotax.svg`, `iconSearchPerson.svg`, `iconQuestions.svg`, `downUploadDocuments.svg` | The filename of an icon |

#### Implementation
The component renders an icon from `/src/icon` based on the filename defined in _icon_ prop. If _icon_ value does not match any predefined value then the default icon `handshake_filled.svg` will be rendered.

#### Customization
You may add your own icons by performing the following steps:
1. Add an _SVG_ icon to icon collection at `/src/icons`
2. import the new icon in module `/src/components/icons.js` as a react component:
```javascript
import { ReactComponent as MyNewIcon } from '../icons/myNewIcon.svg'
```
3. Add the corresponding _switch case_ to the body of the component:
```javascript
switch (props.icon) {
  case "myNewIcon.svg":
    return MyNewIcon
  ...
}
```