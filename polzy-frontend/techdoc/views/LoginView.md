Login View
=========

Login to **PoLZy** comprises  two steps:
1. user authentication by user's email
2. user authorization by selecting a company that the user asign to.

There are three components in `/src/LoginView.js`, which implement that process:
- [AuthView](#authview) (default export)
- [LoginView](#loginview) (internal)
- [CompanySelectView](#companyselectview) (internal)

AuthView
--------------
It is the main component of the authentication view. Its roles are as follow:
- manage the current login view
- set user to the _redux_ store
- redirect user to the home view after the succesfull login

#### Props
| Name | Type     | Description              |
| ---- | -------- | ------------------------ |
| signIn | `func` | _Redux_ reducer that saves _user_ data to the store. |

#### State
| Name | Type     | Default       | Description              |
| ---- | -------- | ------------------------ | ------------------------ |
| user | `object` | `null` | _User_ object to saved in the _redux_ store. |

#### Callbacks
| Name | Description              |
| ---- | ------------------------ |
| handleLogin | **_Fired_** when submitting data on _CompanySelectView_.<br/>**_Accepts_** object that contains _user permissions_ (depending on the selected company).<br/>**_Implementation_**: calls _singIn_ callback to saves collected _user credentials_ and _permissions_ to the _redux_ store then redirects the user to the home view. Pushed to prop _[onSubmit](#props-2)_ of _CompanySelectView_. |
| handleAuthentication | **_Fired_** when submitting data on [LoginView](#loginview).<br/>**_Accepts_** object that contains user data.<br/>**_Implementation_**: checks the quantity the _companies_ associated with the _user_. If the user assigned to only company then calls _signIn_ pushing the company permissions and redirects the user to the home view. Otherwise sets the user data to state `user`. Pushed to prop _[onSubmit](#props-1)_ of _LoginView_. |

#### Implementation
Renders [LoginView](#loginview) if state `user` is `null`. Otherwise, renders [CompanySelectView](#companyselectview).

LoginView
---------------
Provides a login form that gathers user email, one of the possible stages to work in and lnaguage of the interface.

#### Props
| Name | Type     | Description              |
| ---- | -------- | ------------------------ |
| onSubmit | `func` | Callback fired when the submit button is clicked. |

#### State
| Name | Type     | Default       | Description              |
| ---- | -------- | ------------------------ | ------------------------ |
| allStages | `array` | [] | Array of strings that represent possible **_PoLZy_** stages. |
| stage | `string` | `null` | Currently selected stage. |
| user | `object` | {<br/>    email: '',<br/>    error: null,<br/>  } | Currently entered _email_ and associated with it _error_. |

#### Callbacks
| Name | Description              |
| ---- | ------------------------ |
| handleLogin | **_Fired_** when submitting the form.<br/>**_Implementation_**: calls back-end (_[login](#TODO: setlink)_) for user data. If response is successful then fires _onSubmit_ callback. Otherwise, sets state `user.error` to the error message received from the back-end. |
| handleUserChange | **_Fired_** when _email_ field changed.<br/>**_Implementation_**: sets entered _email_ string to state `user.emai`. Also validates the the  _email_ string. If validation fails then sets message "_Invalid email_" (i18n) to state `user.error`. |

#### Implementation
When the component is mounted, it calls back-end (_[getstages](#TODO: setlink)_) for a list of the possible stages. If the response is _OK_, the stages are set to state `allStages`. Form validation routing _validateForm_ checks if the entered email is valid and a stage selected. The submit button enables if the form is valid.

CompanySelectView
-----------------------------

A user could be assigned to multiple companies and organizations. _CompanySelectView_ provides a form to submit a company to work in.

#### Props

| Name     | Type     | Description                                                  |
| -------- | -------- | ------------------------------------------------------------ |
| user     | `object` | Object that contains user credentials and the list of associated companies. |
| onSubmit | `func`   | Callback fired when the submit button is clicked.            |

#### State

| Name    | Type     | Default | Description                                                  |
| ------- | -------- | ------- | ------------------------------------------------------------ |
| company | `object` | null    | Object that contains data of the currently selected company from the user company list. |

#### Callbacks

| Name                | Description                                                  |
| ------------------- | ------------------------------------------------------------ |
| handleCompanySelect | **_Fired_** when submitting the form.<br/>**_Implementation_**: calls back-end (_[getPermissions](#TODO: setlink)_) for user permissions in the selected company. If response is successful then fires _onSubmit_ callback. |
| handleCompanyChange | **_Fired_** when a company is selected from the list of available companies.<br/>**_Implementation_**: sets the selected company object to state `company`. |

#### Implementation

Form validation routing _validateForm_ checks if a company selected. The submit button enables if the form is valid.