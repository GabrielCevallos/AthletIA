---
title: AthletIA API v0.0.1
language_tabs:
  - "'[]'": "'[]'"
language_clients:
  - "'[]'": ""
toc_footers: []
includes: []
search: true
highlight_theme: darkula
headingLevel: 2

---

<!-- Generator: Widdershins v4.0.1 -->

<h1 id="athletia-api">AthletIA API v0.0.1</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

API documentation for AthletIA

Base URLs:

# Authentication

- HTTP Authentication, scheme: bearer 

<h1 id="athletia-api-app">App</h1>

## AppController_getHello

<a id="opIdAppController_getHello"></a>



`GET /`

<h3 id="appcontroller_gethello-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Returns a hello message.|None|

<aside class="success">
This operation does not require authentication
</aside>

## AppController_healthCheck

<a id="opIdAppController_healthCheck"></a>



`GET /health-check`

<h3 id="appcontroller_healthcheck-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Returns the system health status.|None|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="athletia-api-auth">Auth</h1>

## AuthController_signIn

<a id="opIdAuthController_signIn"></a>



`POST /auth/login`

*Sign in with email and password*

Authenticate user with email and password credentials. Returns access and refresh tokens upon successful authentication.

> Body parameter

```json
{
  "email": "user@example.com",
  "password": "Str0ngP@ssw0rd"
}
```

<h3 id="authcontroller_signin-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[LoginRequest](#schemaloginrequest)|true|Login credentials|

> Example responses

> 200 Response

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "accountId": "123e4567-e89b-12d3-a456-426614174000"
  },
  "message": "Login successful"
}
```

> 400 Response

```json
{
  "success": false,
  "message": "email must be an email"
}
```

<h3 id="authcontroller_signin-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Authentication successful - Returns access and refresh tokens|[TokenResponse](#schematokenresponse)|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request - Invalid email format or missing fields|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Invalid credentials or email not verified|Inline|

<h3 id="authcontroller_signin-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## AuthController_registerAccount

<a id="opIdAuthController_registerAccount"></a>



`POST /auth/register-account`

*Register a new account*

> Body parameter

```json
{
  "email": "user@example.com",
  "password": "Str0ngP@ssw0rd"
}
```

<h3 id="authcontroller_registeraccount-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[RegisterAccountRequest](#schemaregisteraccountrequest)|true|none|

> Example responses

> 201 Response

```json
{
  "success": true,
  "message": "We have sent a verification email to your inbox"
}
```

<h3 id="authcontroller_registeraccount-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Account created|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad Request - Validation error or account already exists|Inline|

<h3 id="authcontroller_registeraccount-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## AuthController_verifyEmail

<a id="opIdAuthController_verifyEmail"></a>



`POST /auth/verify-email`

*Verify email using token*

> Body parameter

```json
{
  "token": "jwt-token"
}
```

<h3 id="authcontroller_verifyemail-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|

> Example responses

> 200 Response

```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

<h3 id="authcontroller_verifyemail-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Email verified successfully|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Invalid or expired token|Inline|

<h3 id="authcontroller_verifyemail-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## AuthController_resendVerification

<a id="opIdAuthController_resendVerification"></a>



`POST /auth/resend-verification`

*Resend email verification link*

> Body parameter

```json
{
  "email": "user@example.com"
}
```

<h3 id="authcontroller_resendverification-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|

> Example responses

> 200 Response

```json
{
  "success": true,
  "message": "Verification email sent"
}
```

<h3 id="authcontroller_resendverification-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Verification email sent|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad Request - Too many requests or invalid email|Inline|

<h3 id="authcontroller_resendverification-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## AuthController_resendVerificationStatus

<a id="opIdAuthController_resendVerificationStatus"></a>



`POST /auth/resend-verification-status`

*Get status for resend verification (allowed / wait time)*

> Body parameter

```json
{
  "email": "user@example.com"
}
```

<h3 id="authcontroller_resendverificationstatus-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|

> Example responses

> 200 Response

```json
{
  "success": true,
  "data": {
    "allowed": true,
    "secondsToWait": 0
  },
  "message": "Status fetched"
}
```

<h3 id="authcontroller_resendverificationstatus-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Status payload|Inline|

<h3 id="authcontroller_resendverificationstatus-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## AuthController_forgotPassword

<a id="opIdAuthController_forgotPassword"></a>



`POST /auth/forgot-password`

*Request password reset*

> Body parameter

```json
{
  "email": "user@example.com"
}
```

<h3 id="authcontroller_forgotpassword-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[ForgotPasswordRequest](#schemaforgotpasswordrequest)|true|none|

> Example responses

> 200 Response

```json
{
  "success": true,
  "message": "If the email exists in our system, you will receive a link to reset your password."
}
```

<h3 id="authcontroller_forgotpassword-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Password reset email sent (if email exists)|Inline|
|429|[Too Many Requests](https://tools.ietf.org/html/rfc6585#section-4)|Too Many Requests|None|

<h3 id="authcontroller_forgotpassword-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## AuthController_resetPassword

<a id="opIdAuthController_resetPassword"></a>



`POST /auth/reset-password`

*Reset password using token*

> Body parameter

```json
{
  "token": "token123...",
  "newPassword": "NewP@ss1234"
}
```

<h3 id="authcontroller_resetpassword-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[ResetPasswordRequest](#schemaresetpasswordrequest)|true|none|

> Example responses

> 200 Response

```json
{
  "success": true,
  "message": "Password reset successfully. You can now log in with your new password."
}
```

<h3 id="authcontroller_resetpassword-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Password reset successfully|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Invalid token or password requirements not met|Inline|

<h3 id="authcontroller_resetpassword-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## AuthController_changePassword

<a id="opIdAuthController_changePassword"></a>



`PATCH /auth/change-password`

*Change account password*

> Body parameter

```json
{
  "accountId": "uuid",
  "changePasswordRequest": {
    "currentPassword": "OldP@ss123",
    "newPassword": "NewP@ss1234"
  }
}
```

<h3 id="authcontroller_changepassword-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» accountId|body|string|true|none|
|» changePasswordRequest|body|[ChangePasswordRequest](#schemachangepasswordrequest)|true|none|
|»» currentPassword|body|string|true|Current password|
|»» newPassword|body|string|true|New password|

> Example responses

> 400 Response

```json
{
  "message": [
    "currentPassword must be a string",
    "newPassword must be longer than or equal to 8 characters",
    "newPassword must contain uppercase, lowercase, number and special character",
    "Current password is incorrect"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

<h3 id="authcontroller_changepassword-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Password changed|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad Request - Invalid password or validation error|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized - Invalid account|None|

<h3 id="authcontroller_changepassword-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## AuthController_refreshToken

<a id="opIdAuthController_refreshToken"></a>



`POST /auth/refresh-token`

*Refresh tokens using a refresh token*

Generate new access and refresh tokens using a valid refresh token. Useful when the access token has expired.

> Body parameter

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

<h3 id="authcontroller_refreshtoken-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|Refresh token request|
|» refreshToken|body|string|true|Valid refresh token|

> Example responses

> 200 Response

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "accountId": "123e4567-e89b-12d3-a456-426614174000"
  },
  "message": "Token refreshed"
}
```

> 400 Response

```json
{
  "success": false,
  "message": "refreshToken is required"
}
```

<h3 id="authcontroller_refreshtoken-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|New tokens generated successfully|[TokenResponse](#schematokenresponse)|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request - Missing refresh token|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Invalid, expired, or revoked refresh token|Inline|

<h3 id="authcontroller_refreshtoken-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## AuthController_logout

<a id="opIdAuthController_logout"></a>



`POST /auth/logout`

*Logout and clear refresh token*

> Body parameter

```json
{
  "accountId": "uuid"
}
```

<h3 id="authcontroller_logout-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|

> Example responses

> 200 Response

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

<h3 id="authcontroller_logout-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Logged out successfully|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Invalid Account ID|Inline|

<h3 id="authcontroller_logout-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## AuthController_googleMobileLogin

<a id="opIdAuthController_googleMobileLogin"></a>



`POST /auth/google/mobile`

*Google Mobile Login*

Authenticate user using a Google Access Token obtained from a mobile device.

> Body parameter

```json
{
  "token": "ya29.a0AfH6SM..."
}
```

<h3 id="authcontroller_googlemobilelogin-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|Google Access Token|
|» token|body|string|false|none|

> Example responses

> 200 Response

```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "accountId": "uuid"
}
```

<h3 id="authcontroller_googlemobilelogin-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Authentication successful|[TokenResponse](#schematokenresponse)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Invalid Google Token|None|

<aside class="success">
This operation does not require authentication
</aside>

## AuthController_googleAuth

<a id="opIdAuthController_googleAuth"></a>



`GET /auth/google`

*Start Google OAuth flow*

<h3 id="authcontroller_googleauth-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|302|[Found](https://tools.ietf.org/html/rfc7231#section-6.4.3)|Redirect to Google|None|

<aside class="success">
This operation does not require authentication
</aside>

## AuthController_googleCallback

<a id="opIdAuthController_googleCallback"></a>



`GET /auth/google/redirect`

*Google OAuth callback*

<h3 id="authcontroller_googlecallback-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|302|[Found](https://tools.ietf.org/html/rfc7231#section-6.4.3)|Redirect to frontend with tokens|None|

<aside class="success">
This operation does not require authentication
</aside>

## AuthController_me

<a id="opIdAuthController_me"></a>



`GET /auth/me`

*Get authenticated user*

> Example responses

> 200 Response

```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "status": "ACTIVE",
    "role": "USER",
    "hasProfile": true,
    "name": "Jane Doe",
    "birthDate": null
  },
  "message": "Authenticated user fetched"
}
```

<h3 id="authcontroller_me-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Authenticated user returned|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|Inline|

<h3 id="authcontroller_me-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» data|[User](#schemauser)|false|none|none|
|»» email|string|true|none|User email|
|»» id|string|true|none|User ID|
|»» state|string|true|none|Account status - Valid values: ACTIVE, SUSPENDED, DEACTIVATED|
|»» role|string|true|none|Assigned role - Valid values: user, admin, moderator|
|»» hasProfile|boolean|true|none|Indicates if profile exists|
|»» name|object¦null|true|none|Full name|
|»» birthDate|object¦null|true|none|Birth date|
|» message|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|state|ACTIVE|
|state|SUSPENDED|
|state|DEACTIVATED|
|role|user|
|role|admin|
|role|moderator|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="athletia-api-users">Users</h1>

## AccountsController_findAll

<a id="opIdAccountsController_findAll"></a>



`GET /users`

*List users with pagination*

<h3 id="accountscontroller_findall-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|limit|query|number|false|Items per page|
|offset|query|number|false|Pagination offset|

> Example responses

> 200 Response

```json
{
  "success": true,
  "message": "User list fetched successfully",
  "items": [
    {
      "email": "user@example.com",
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "state": "ACTIVE",
      "role": "user",
      "hasProfile": true,
      "name": "Jane Doe",
      "birthDate": "1990-01-01"
    }
  ],
  "total": 100,
  "limit": 10,
  "offset": 0
}
```

<h3 id="accountscontroller_findall-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Users retrieved successfully|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden - Insufficient permissions|None|

<h3 id="accountscontroller_findall-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## AccountsController_findOne

<a id="opIdAccountsController_findOne"></a>



`GET /users/{id}`

*Get user by ID*

<h3 id="accountscontroller_findone-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

> Example responses

> 200 Response

```json
{
  "success": true,
  "message": "User fetched successfully",
  "data": {
    "email": "user@example.com",
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "state": "ACTIVE",
    "role": "user",
    "hasProfile": true,
    "name": "Jane Doe",
    "birthDate": "1990-01-01"
  }
}
```

<h3 id="accountscontroller_findone-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|User details fetched successfully|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden - Insufficient permissions|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|User not found|None|

<h3 id="accountscontroller_findone-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## AccountsController_suspendAccount

<a id="opIdAccountsController_suspendAccount"></a>



`PATCH /users/{id}/suspend`

*Suspend user by ID*

<h3 id="accountscontroller_suspendaccount-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

> Example responses

> 200 Response

```json
{
  "success": true,
  "message": "Account suspended/activated successfully"
}
```

<h3 id="accountscontroller_suspendaccount-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|User suspended successfully|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden - Admin/Moderator only|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|User not found|None|

<h3 id="accountscontroller_suspendaccount-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## AccountsController_giveRole

<a id="opIdAccountsController_giveRole"></a>



`PATCH /users/{id}/give-role`

*Assign role to user*

> Body parameter

```json
{
  "role": "user"
}
```

<h3 id="accountscontroller_giverole-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|object|true|none|

> Example responses

> 200 Response

```json
{
  "success": true,
  "message": "Role updated successfully"
}
```

<h3 id="accountscontroller_giverole-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Role assigned successfully|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad Request - Invalid role or operation|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden - Admin only|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|User not found|None|

<h3 id="accountscontroller_giverole-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## AccountsController_requestModeratorRole

<a id="opIdAccountsController_requestModeratorRole"></a>



`POST /users/request-moderator`

*Request moderator role*

> Example responses

> 200 Response

```json
{
  "success": true,
  "message": "Moderator role requested successfully"
}
```

<h3 id="accountscontroller_requestmoderatorrole-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Moderator role request submitted successfully|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|User not found|None|

<h3 id="accountscontroller_requestmoderatorrole-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="athletia-api-profiles">Profiles</h1>

## ProfilesController_updateProfile

<a id="opIdProfilesController_updateProfile"></a>



`PATCH /profiles`

*Update own profile*

> Body parameter

```json
{
  "name": "Jane Doe",
  "birthDate": "1990-01-01",
  "phoneNumber": "5512345678",
  "language": "spanish",
  "notificationPreferences": {
    "routines": true,
    "exercises": true,
    "system": true
  }
}
```

<h3 id="profilescontroller_updateprofile-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[ProfileUpdate](#schemaprofileupdate)|true|none|

> Example responses

> 200 Response

```json
{
  "success": true,
  "message": "Profile updated successfully"
}
```

<h3 id="profilescontroller_updateprofile-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Profile updated successfully|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad Request - Validation error. Invalid field values|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden - Account suspended or deactivated|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Profile not found|None|

<h3 id="profilescontroller_updateprofile-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## ProfilesController_completeProfileSetup

<a id="opIdProfilesController_completeProfileSetup"></a>



`POST /profiles/complete-setup`

*Complete profile setup*

> Body parameter

```json
{
  "name": "Jane Doe",
  "birthDate": "1990-01-01",
  "phoneNumber": "5512345678",
  "language": "spanish",
  "gender": "male",
  "fitGoals": [
    "weight_loss",
    "muscle_gain"
  ]
}
```

<h3 id="profilescontroller_completeprofilesetup-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[ProfileRequest](#schemaprofilerequest)|true|none|

> Example responses

> 201 Response

```json
{
  "success": true,
  "message": "Profile created successfully",
  "data": {
    "name": "Jane Doe",
    "birthDate": "1990-01-01",
    "phoneNumber": "5512345678",
    "gender": "female",
    "fitGoals": [
      "lose_weight"
    ],
    "language": "spanish",
    "email": "user@example.com",
    "createdAt": "2024-01-01T12:00:00Z",
    "updatedAt": "2024-01-01T12:00:00Z",
    "age": 34,
    "currentStreak": 1,
    "maxStreak": 1,
    "lastWeight": 75.5,
    "notificationPreferences": {
      "routines": true,
      "exercises": true,
      "system": true
    }
  }
}
```

<h3 id="profilescontroller_completeprofilesetup-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Profile created successfully|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad Request - Validation error or Profile already exists|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden|None|

<h3 id="profilescontroller_completeprofilesetup-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## ProfilesController_getProfileByAccountId

<a id="opIdProfilesController_getProfileByAccountId"></a>



`GET /profiles/by-account/{accountId}`

*Get profile by account ID*

<h3 id="profilescontroller_getprofilebyaccountid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|accountId|path|string|true|none|

> Example responses

> 200 Response

```json
{
  "success": true,
  "message": "Profile fetched successfully",
  "data": {
    "name": "Jane Doe",
    "birthDate": "1990-01-01",
    "phoneNumber": "5512345678",
    "gender": "female",
    "fitGoals": [
      "lose_weight"
    ],
    "language": "english",
    "email": "user@example.com",
    "createdAt": "2024-01-01T12:00:00Z",
    "updatedAt": "2024-01-02T12:00:00Z",
    "age": 34,
    "currentStreak": 5,
    "maxStreak": 10,
    "lastWeight": 75.5,
    "notificationPreferences": {
      "routines": true,
      "exercises": true,
      "system": true
    }
  }
}
```

<h3 id="profilescontroller_getprofilebyaccountid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Profile fetched successfully|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Profile not found|None|

<h3 id="profilescontroller_getprofilebyaccountid-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## ProfilesController_findMyProfile

<a id="opIdProfilesController_findMyProfile"></a>



`GET /profiles/me`

*Get current user profile*

> Example responses

> 200 Response

```json
{
  "success": true,
  "message": "Profile fetched successfully",
  "data": {
    "name": "Jane Doe",
    "birthDate": "1990-01-01",
    "phoneNumber": "5512345678",
    "gender": "female",
    "fitGoals": [
      "lose_weight",
      "build_muscle"
    ],
    "language": "english",
    "email": "user@example.com",
    "createdAt": "2024-01-01T12:00:00Z",
    "updatedAt": "2024-01-02T12:00:00Z",
    "age": 34,
    "currentStreak": 5,
    "maxStreak": 10,
    "lastWeight": 75.5,
    "notificationPreferences": {
      "routines": true,
      "exercises": true,
      "system": true
    }
  }
}
```

<h3 id="profilescontroller_findmyprofile-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Profile fetched successfully|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Profile not found|None|

<h3 id="profilescontroller_findmyprofile-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="athletia-api-measurements">Measurements</h1>

## MeasurementsController_findAll

<a id="opIdMeasurementsController_findAll"></a>



`GET /measurements`

*List measurements (admin use)*

Get all measurements. Only accessible by administrators.

> Example responses

> 200 Response

```json
{
  "success": true,
  "message": "Measurements retrieved successfully",
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "weight": 75.5,
      "height": 180,
      "imc": 23.3,
      "left_arm": 35,
      "right_arm": 35,
      "left_forearm": 28,
      "right_forearm": 28,
      "clavicular_width": 38,
      "neck_diameter": 38,
      "chest_size": 98,
      "back_width": 42,
      "hip_diameter": 98,
      "left_leg": 60,
      "right_leg": 60,
      "left_calve": 38,
      "right_calve": 38,
      "checkTime": "WEEKLY",
      "createdAt": "2024-01-01T10:00:00Z",
      "updatedAt": "2024-01-01T10:00:00Z"
    }
  ]
}
```

<h3 id="measurementscontroller_findall-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Measurements retrieved successfully|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized - No valid authentication token|None|

<h3 id="measurementscontroller_findall-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## MeasurementsController_getMyMeasurement

<a id="opIdMeasurementsController_getMyMeasurement"></a>



`GET /measurements/me`

*Get my measurement*

Retrieve the authenticated user's current measurement.

> Example responses

> 200 Response

```json
{
  "success": true,
  "message": "Measurement retrieved successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "weight": 75.5,
    "height": 180,
    "imc": 23.3,
    "left_arm": 35,
    "right_arm": 35,
    "left_forearm": 28,
    "right_forearm": 28,
    "clavicular_width": 38,
    "neck_diameter": 38,
    "chest_size": 98,
    "back_width": 42,
    "hip_diameter": 98,
    "left_leg": 60,
    "right_leg": 60,
    "left_calve": 38,
    "right_calve": 38,
    "checkTime": "morning",
    "createdAt": "2024-01-01T10:00:00Z",
    "updatedAt": "2024-01-01T10:00:00Z"
  }
}
```

<h3 id="measurementscontroller_getmymeasurement-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Measurement retrieved successfully|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized - No valid authentication token|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Measurement not found|None|

<h3 id="measurementscontroller_getmymeasurement-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## MeasurementsController_createMyMeasurement

<a id="opIdMeasurementsController_createMyMeasurement"></a>



`POST /measurements/me`

*Create or update measurement*

Create a new measurement or update existing one for authenticated user.

> Body parameter

```json
{
  "weight": 75.5,
  "height": 180,
  "left_arm": 0,
  "right_arm": 0,
  "left_forearm": 0,
  "right_forearm": 0,
  "clavicular_width": 0,
  "neck_diameter": 0,
  "chest_size": 0,
  "back_width": 0,
  "hip_diameter": 0,
  "left_leg": 0,
  "right_leg": 0,
  "left_calve": 0,
  "right_calve": 0,
  "checkTime": "WEEKLY"
}
```

<h3 id="measurementscontroller_createmymeasurement-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[MeasurementRequest](#schemameasurementrequest)|true|none|

> Example responses

> 201 Response

```json
{
  "success": true,
  "message": "Measurement created successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "weight": 75.5,
    "height": 180,
    "imc": 23.3,
    "left_arm": 35,
    "right_arm": 35,
    "left_forearm": 28,
    "right_forearm": 28,
    "clavicular_width": 38,
    "neck_diameter": 38,
    "chest_size": 98,
    "back_width": 42,
    "hip_diameter": 98,
    "left_leg": 60,
    "right_leg": 60,
    "left_calve": 38,
    "right_calve": 38,
    "checkTime": "morning",
    "createdAt": "2024-01-01T10:00:00Z",
    "updatedAt": "2024-01-01T10:00:00Z"
  }
}
```

<h3 id="measurementscontroller_createmymeasurement-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Measurement created successfully|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad Request - Validation error. Invalid or missing required fields|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized - No valid authentication token|None|

<h3 id="measurementscontroller_createmymeasurement-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## MeasurementsController_editMyMeasurement

<a id="opIdMeasurementsController_editMyMeasurement"></a>



`PATCH /measurements/me`

*Update measurement*

Update the authenticated user's measurement.

> Body parameter

```json
{
  "weight": 75.5,
  "height": 180,
  "left_arm": 0,
  "right_arm": 0,
  "left_forearm": 0,
  "right_forearm": 0,
  "clavicular_width": 0,
  "neck_diameter": 0,
  "chest_size": 0,
  "back_width": 0,
  "hip_diameter": 0,
  "left_leg": 0,
  "right_leg": 0,
  "left_calve": 0,
  "right_calve": 0,
  "checkTime": "WEEKLY"
}
```

<h3 id="measurementscontroller_editmymeasurement-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[MeasurementUpdate](#schemameasurementupdate)|true|none|

> Example responses

> 200 Response

```json
{
  "success": true,
  "message": "Measurement updated successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "weight": 76,
    "height": 180,
    "imc": 23.5,
    "left_arm": 35.5,
    "right_arm": 35.5,
    "left_forearm": 28.5,
    "right_forearm": 28.5,
    "clavicular_width": 38,
    "neck_diameter": 38,
    "chest_size": 99,
    "back_width": 42,
    "hip_diameter": 99,
    "left_leg": 60.5,
    "right_leg": 60.5,
    "left_calve": 38.5,
    "right_calve": 38.5,
    "checkTime": "morning",
    "createdAt": "2024-01-01T10:00:00Z",
    "updatedAt": "2024-01-02T11:30:00Z"
  }
}
```

<h3 id="measurementscontroller_editmymeasurement-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Measurement updated successfully|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad Request - Validation error. Invalid field values|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized - No valid authentication token|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Measurement not found|None|

<h3 id="measurementscontroller_editmymeasurement-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## MeasurementsController_findOne

<a id="opIdMeasurementsController_findOne"></a>



`GET /measurements/{id}`

*Get a measurement by id (admin use)*

<h3 id="measurementscontroller_findone-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

> Example responses

> 200 Response

```json
{
  "success": true,
  "message": "Measurement retrieved successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "weight": 75.5,
    "height": 180,
    "imc": 23.3,
    "left_arm": 35,
    "right_arm": 35,
    "left_forearm": 28,
    "right_forearm": 28,
    "clavicular_width": 38,
    "neck_diameter": 38,
    "chest_size": 98,
    "back_width": 42,
    "hip_diameter": 98,
    "left_leg": 60,
    "right_leg": 60,
    "left_calve": 38,
    "right_calve": 38,
    "checkTime": "morning",
    "createdAt": "2024-01-01T10:00:00Z",
    "updatedAt": "2024-01-01T10:00:00Z"
  }
}
```

<h3 id="measurementscontroller_findone-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Measurement retrieved successfully|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Measurement not found|None|

<h3 id="measurementscontroller_findone-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## MeasurementsController_remove

<a id="opIdMeasurementsController_remove"></a>



`DELETE /measurements/{id}`

*Delete measurement*

Delete the authenticated user's measurement.

<h3 id="measurementscontroller_remove-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="measurementscontroller_remove-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Measurement deleted successfully|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized - No valid authentication token|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Measurement not found|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

<h1 id="athletia-api-splits">Splits</h1>

## SplitsController_create

<a id="opIdSplitsController_create"></a>



`POST /workout/splits`

*Create split*

Create a new split. Any authenticated user can create splits. Official flag is automatically set to false.

> Body parameter

```json
{
  "name": "Upper/Lower",
  "description": "4-day weekly program split into upper and lower.",
  "routineIds": [
    "497f6eca-6276-4993-bfeb-53cbbbba6f08"
  ],
  "trainingDays": [
    "Monday"
  ],
  "official": false
}
```

<h3 id="splitscontroller_create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[SplitRequest](#schemasplitrequest)|true|none|

> Example responses

> 201 Response

```json
{
  "success": true,
  "message": "Split created successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Upper/Lower",
    "description": "4-day weekly program split into upper and lower.",
    "routineIds": [
      "123e4567-e89b-12d3-a456-426614174001"
    ],
    "trainingDays": [
      "Monday",
      "Tuesday",
      "Thursday",
      "Friday"
    ],
    "official": false,
    "createdAt": "2024-01-01T12:00:00Z",
    "updatedAt": "2024-01-01T12:00:00Z",
    "routines": []
  }
}
```

<h3 id="splitscontroller_create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Split created successfully|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad Request - Validation error. Invalid or missing required fields|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized - No valid authentication token|None|

<h3 id="splitscontroller_create-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## SplitsController_findAll

<a id="opIdSplitsController_findAll"></a>



`GET /workout/splits`

*List splits with pagination*

Get a paginated list of all splits. Accessible by all authenticated users. This action updates the user daily streak.

<h3 id="splitscontroller_findall-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|limit|query|number|false|Number of items per page|
|offset|query|number|false|Number of items to skip|

> Example responses

> 200 Response

```json
{
  "success": true,
  "message": "Splits retrieved successfully",
  "data": {
    "items": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "name": "Upper/Lower",
        "description": "4-day weekly program split into upper and lower.",
        "trainingDays": [
          "Monday",
          "Tuesday",
          "Thursday",
          "Friday"
        ],
        "official": false,
        "createdAt": "2024-01-01T12:00:00Z",
        "updatedAt": "2024-01-01T12:00:00Z",
        "routines": []
      }
    ],
    "total": 20,
    "limit": 10,
    "offset": 0
  }
}
```

<h3 id="splitscontroller_findall-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Paginated split list retrieved successfully|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized - No valid authentication token|None|

<h3 id="splitscontroller_findall-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## SplitsController_findOne

<a id="opIdSplitsController_findOne"></a>



`GET /workout/splits/{id}`

*Get split by ID*

Retrieve a specific split by its ID. Accessible by all authenticated users.

<h3 id="splitscontroller_findone-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string(uuid)|true|Split UUID|

> Example responses

> 200 Response

```json
{
  "success": true,
  "message": "Split retrieved successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Upper/Lower",
    "description": "4-day weekly program split into upper and lower.",
    "trainingDays": [
      "Monday",
      "Tuesday",
      "Thursday",
      "Friday"
    ],
    "official": false,
    "createdAt": "2024-01-01T12:00:00Z",
    "updatedAt": "2024-01-01T12:00:00Z",
    "routines": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174001",
        "name": "Upper Body A"
      }
    ]
  }
}
```

<h3 id="splitscontroller_findone-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Split retrieved successfully|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized - No valid authentication token|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Split not found|None|

<h3 id="splitscontroller_findone-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## SplitsController_update

<a id="opIdSplitsController_update"></a>



`PATCH /workout/splits/{id}`

*Update split*

Update a split. Only the owner of the split or users with ADMIN role can update it.

> Body parameter

```json
{
  "name": "string",
  "description": "stringstri",
  "routineIds": [
    "497f6eca-6276-4993-bfeb-53cbbbba6f08"
  ],
  "trainingDays": [
    "Monday"
  ],
  "official": false
}
```

<h3 id="splitscontroller_update-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string(uuid)|true|Split UUID|
|body|body|[SplitUpdate](#schemasplitupdate)|true|none|

> Example responses

> 200 Response

```json
{
  "success": true,
  "message": "Split updated successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Upper/Lower",
    "description": "4-day weekly program split into upper and lower.",
    "trainingDays": [
      "Monday",
      "Tuesday",
      "Thursday",
      "Friday"
    ],
    "official": false,
    "createdAt": "2024-01-01T12:00:00Z",
    "updatedAt": "2024-01-01T12:00:00Z"
  }
}
```

<h3 id="splitscontroller_update-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Split updated successfully|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad Request - Validation error. Invalid field values|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized - No valid authentication token|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden - You can only modify splits that belong to you|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Split not found|None|

<h3 id="splitscontroller_update-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## SplitsController_remove

<a id="opIdSplitsController_remove"></a>



`DELETE /workout/splits/{id}`

*Delete split*

Delete a split. Only the owner of the split or users with ADMIN role can delete it.

<h3 id="splitscontroller_remove-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string(uuid)|true|Split UUID|

<h3 id="splitscontroller_remove-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Split deleted successfully|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized - No valid authentication token|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden - You can only delete splits that belong to you|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Split not found|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

<h1 id="athletia-api-routines">Routines</h1>

## RoutinesController_create

<a id="opIdRoutinesController_create"></a>



`POST /workout/routines`

*Create routine*

Create a new routine. Any authenticated user can create routines. Routines created by ADMIN users are automatically marked as official.

> Body parameter

```json
{
  "name": "Upper/Lower Hypertrophy",
  "description": "4-day program focused on strength and hypertrophy.",
  "exerciseIds": [
    "497f6eca-6276-4993-bfeb-53cbbbba6f08"
  ],
  "routineGoal": [
    "weight_loss"
  ],
  "official": false
}
```

<h3 id="routinescontroller_create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[RoutineRequest](#schemaroutinerequest)|true|none|

> Example responses

> 201 Response

```json
{
  "success": true,
  "message": "Routine created successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Upper/Lower Hypertrophy",
    "description": "4-day program focused on strength and hypertrophy.",
    "exerciseIds": [
      "123e4567-e89b-12d3-a456-426614174001"
    ],
    "routineGoal": [
      "muscle_gain"
    ],
    "official": false,
    "createdAt": "2024-01-01T12:00:00Z",
    "updatedAt": "2024-01-01T12:00:00Z",
    "nExercises": 1,
    "userId": "123e4567-e89b-12d3-a456-426614174099"
  }
}
```

<h3 id="routinescontroller_create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Routine created successfully.|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad Request - Validation error. Invalid or missing required fields|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized - No valid authentication token|None|

<h3 id="routinescontroller_create-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## RoutinesController_findAll

<a id="opIdRoutinesController_findAll"></a>



`GET /workout/routines`

*List routines with pagination*

Get a paginated list of all routines. Accessible by all authenticated users. This action updates the user daily streak.

<h3 id="routinescontroller_findall-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|limit|query|number|false|Number of items per page|
|offset|query|number|false|Number of items to skip|

> Example responses

> 200 Response

```json
{
  "success": true,
  "message": "Routines retrieved successfully",
  "data": {
    "items": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "name": "Upper/Lower Hypertrophy",
        "description": "4-day program focused on strength and hypertrophy.",
        "routineGoal": [
          "muscle_gain"
        ],
        "official": false,
        "exercises": [
          {
            "id": "123e4567-e89b-12d3-a456-426614174001",
            "name": "Barbell Bench Press",
            "description": "Composite exercise for chest development."
          }
        ],
        "nExercises": 1,
        "createdAt": "2024-01-01T12:00:00Z",
        "updatedAt": "2024-01-01T12:00:00Z"
      }
    ],
    "total": 30,
    "limit": 10,
    "offset": 0
  }
}
```

<h3 id="routinescontroller_findall-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Paginated routine list retrieved successfully|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized - No valid authentication token|None|

<h3 id="routinescontroller_findall-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## RoutinesController_findOne

<a id="opIdRoutinesController_findOne"></a>



`GET /workout/routines/{id}`

*Get routine by ID*

Retrieve a specific routine by its ID. Accessible by all authenticated users.

<h3 id="routinescontroller_findone-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string(uuid)|true|Routine UUID|

> Example responses

> 200 Response

```json
{
  "success": true,
  "message": "Routine retrieved successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Upper/Lower Hypertrophy",
    "description": "Description...",
    "routineGoal": [
      "muscle_gain"
    ],
    "official": false,
    "createdAt": "2024-01-01T12:00:00Z",
    "updatedAt": "2024-01-01T12:00:00Z",
    "nExercises": 5,
    "exercises": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174001",
        "name": "Bench Press"
      }
    ]
  }
}
```

<h3 id="routinescontroller_findone-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Routine retrieved successfully|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized - No valid authentication token|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Routine not found|None|

<h3 id="routinescontroller_findone-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## RoutinesController_update

<a id="opIdRoutinesController_update"></a>



`PATCH /workout/routines/{id}`

*Update routine*

Update a routine. Only the owner of the routine or users with ADMIN role can update it.

> Body parameter

```json
{
  "name": "Upper/Lower Hypertrophy",
  "description": "stringstri",
  "exerciseIds": [
    "497f6eca-6276-4993-bfeb-53cbbbba6f08"
  ],
  "routineGoal": [
    "weight_loss"
  ],
  "official": false
}
```

<h3 id="routinescontroller_update-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string(uuid)|true|Routine UUID|
|body|body|[RoutineUpdate](#schemaroutineupdate)|true|none|

> Example responses

> 200 Response

```json
{
  "success": true,
  "message": "Routine updated successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Upper/Lower Hypertrophy",
    "description": "Updated description...",
    "routineGoal": [
      "muscle_gain"
    ],
    "official": false,
    "createdAt": "2024-01-01T12:00:00Z",
    "updatedAt": "2024-01-02T12:00:00Z",
    "nExercises": 5
  }
}
```

<h3 id="routinescontroller_update-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Routine updated successfully|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad Request - Validation error. Invalid field values|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized - No valid authentication token|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden - You can only modify routines that belong to you|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Routine not found|None|

<h3 id="routinescontroller_update-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## RoutinesController_remove

<a id="opIdRoutinesController_remove"></a>



`DELETE /workout/routines/{id}`

*Delete routine*

Delete a routine. Only the owner of the routine or users with ADMIN role can delete it.

<h3 id="routinescontroller_remove-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string(uuid)|true|Routine UUID|

<h3 id="routinescontroller_remove-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Routine deleted successfully|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized - No valid authentication token|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden - You can only delete routines that belong to you|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Routine not found|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

<h1 id="athletia-api-notifications">Notifications</h1>

## NotificationsController_getUserNotifications

<a id="opIdNotificationsController_getUserNotifications"></a>



`GET /Notifications`

*Get user notifications*

<h3 id="notificationscontroller_getusernotifications-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|limit|query|number|false|none|
|offset|query|number|false|none|

> Example responses

> 200 Response

```json
{
  "success": true,
  "message": "Notifications retrieved successfully",
  "data": {
    "items": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "title": "Rutina completada",
        "message": "Has completado tu rutina de fuerza.",
        "type": "success",
        "isRead": false,
        "createdAt": "2024-02-03T12:00:00Z",
        "userId": "123e4567-e89b-12d3-a456-426614174001"
      }
    ],
    "total": 1
  }
}
```

<h3 id="notificationscontroller_getusernotifications-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Notifications retrieved successfully|Inline|

<h3 id="notificationscontroller_getusernotifications-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## NotificationsController_getUnreadCount

<a id="opIdNotificationsController_getUnreadCount"></a>



`GET /Notifications/unread-count`

*Get unread notifications count*

> Example responses

> 200 Response

```json
{
  "success": true,
  "message": "Count retrieved successfully",
  "data": {
    "count": 5
  }
}
```

<h3 id="notificationscontroller_getunreadcount-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Count retrieved successfully|Inline|

<h3 id="notificationscontroller_getunreadcount-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## NotificationsController_markAsRead

<a id="opIdNotificationsController_markAsRead"></a>



`PATCH /Notifications/{id}/read`

*Mark notification as read*

<h3 id="notificationscontroller_markasread-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string(uuid)|true|none|

> Example responses

> 200 Response

```json
{
  "success": true,
  "message": "Notification marked as read",
  "data": {
    "success": true
  }
}
```

<h3 id="notificationscontroller_markasread-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Marked as read successfully|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Notification not found|None|

<h3 id="notificationscontroller_markasread-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## NotificationsController_markAllAsRead

<a id="opIdNotificationsController_markAllAsRead"></a>



`PATCH /Notifications/read-all`

*Mark all notifications as read*

> Example responses

> 200 Response

```json
{
  "success": true,
  "message": "All notifications marked as read",
  "data": {
    "success": true
  }
}
```

<h3 id="notificationscontroller_markallasread-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|All marked as read successfully|Inline|

<h3 id="notificationscontroller_markallasread-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

<h1 id="athletia-api-exercises">Exercises</h1>

## ExercisesController_create

<a id="opIdExercisesController_create"></a>



`POST /workout/exercises`

*Create exercise*

Create a new exercise. Only accessible by users with ADMIN role.

> Body parameter

```json
{
  "name": "Bench Press",
  "description": "Barbell bench press on a flat bench.",
  "equipment": "barbell",
  "parentExerciseId": "123e4567-e89b-12d3-a456-426614174000",
  "video": "https://example.com/video",
  "minSets": 3,
  "maxSets": 5,
  "minReps": 8,
  "maxReps": 15,
  "minRestTime": 60,
  "maxRestTime": 120,
  "muscleTarget": [
    "chest"
  ],
  "exerciseType": [
    "cardio"
  ],
  "instructions": [
    "Step 1: Position yourself",
    "Step 2: Execute the movement"
  ],
  "benefit": {
    "title": "Increases strength",
    "description": "Builds chest and triceps strength",
    "categories": [
      "Cardio",
      "Fuerza",
      "Resistencia"
    ]
  }
}
```

<h3 id="exercisescontroller_create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[ExerciseRequest](#schemaexerciserequest)|true|none|

> Example responses

> 201 Response

```json
{
  "success": true,
  "message": "Exercise created successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Barbell Bench Press",
    "description": "Composite exercise for chest development.",
    "equipment": "barbell",
    "parentExerciseId": null,
    "video": "https://example.com/bench-press",
    "minSets": 3,
    "maxSets": 5,
    "minReps": 8,
    "maxReps": 12,
    "minRestTime": 90,
    "maxRestTime": 180,
    "muscleTarget": [
      "chest",
      "triceps",
      "deltoids"
    ],
    "exerciseType": [
      "strength",
      "bodybuilding"
    ],
    "instructions": [
      "Lie on bench",
      "Lower bar to chest",
      "Press up"
    ],
    "benefit": {
      "title": "Builds upper body strength",
      "description": "Focuses on pectorals and triceps",
      "categories": [
        "Strength"
      ]
    },
    "createdAt": "2024-01-01T10:00:00Z",
    "updatedAt": "2024-01-01T10:00:00Z"
  }
}
```

<h3 id="exercisescontroller_create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Exercise created successfully|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad Request - Validation error. Invalid or missing required fields|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized - No valid authentication token|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden - Only administrators can create exercises|None|

<h3 id="exercisescontroller_create-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## ExercisesController_findAll

<a id="opIdExercisesController_findAll"></a>



`GET /workout/exercises`

*List exercises with pagination*

Get a paginated list of all exercises. Filter by muscle target to get specific exercises. Accessible by all authenticated users.

<h3 id="exercisescontroller_findall-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|limit|query|number|false|Number of items per page|
|offset|query|number|false|Number of items to skip|
|muscleTarget|query|array[string]|false|Filter by target muscles. Valid values: chest, core, trapezius, lats, deltoids, triceps, biceps, forearms, quads, hamstrings, glutes, adductors, calves, neck|

#### Enumerated Values

|Parameter|Value|
|---|---|
|muscleTarget|chest|
|muscleTarget|core|
|muscleTarget|trapezius|
|muscleTarget|lats|
|muscleTarget|deltoids|
|muscleTarget|triceps|
|muscleTarget|biceps|
|muscleTarget|forearms|
|muscleTarget|quads|
|muscleTarget|hamstrings|
|muscleTarget|glutes|
|muscleTarget|adductors|
|muscleTarget|calves|
|muscleTarget|neck|

> Example responses

> 200 Response

```json
{
  "success": true,
  "message": "Exercises retrieved successfully",
  "data": {
    "items": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "name": "Barbell Bench Press",
        "description": "Composite exercise for chest development.",
        "equipment": "barbell",
        "muscleTarget": [
          "chest",
          "triceps"
        ],
        "exerciseType": [
          "strength"
        ],
        "video": "https://example.com/video"
      }
    ],
    "total": 50,
    "limit": 10,
    "offset": 0
  }
}
```

<h3 id="exercisescontroller_findall-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Paginated exercise list retrieved successfully|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad Request - Invalid muscleTarget value|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized - No valid authentication token|None|

<h3 id="exercisescontroller_findall-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## ExercisesController_findOne

<a id="opIdExercisesController_findOne"></a>



`GET /workout/exercises/{id}`

*Get exercise by ID*

Retrieve a specific exercise by its ID. Accessible by all authenticated users.

<h3 id="exercisescontroller_findone-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string(uuid)|true|Exercise UUID|

> Example responses

> 200 Response

```json
{
  "success": true,
  "message": "Exercise retrieved successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Barbell Bench Press",
    "description": "Composite exercise for chest development.",
    "equipment": "barbell",
    "video": "https://example.com/bench-press",
    "muscleTarget": [
      "chest",
      "triceps"
    ],
    "exerciseType": [
      "strength"
    ],
    "createdAt": "2024-01-01T10:00:00Z",
    "updatedAt": "2024-01-01T10:00:00Z"
  }
}
```

<h3 id="exercisescontroller_findone-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Exercise retrieved successfully|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized - No valid authentication token|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Exercise not found|None|

<h3 id="exercisescontroller_findone-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## ExercisesController_update

<a id="opIdExercisesController_update"></a>



`PATCH /workout/exercises/{id}`

*Update exercise*

Update an existing exercise. Only accessible by users with ADMIN role.

> Body parameter

```json
{
  "name": "Bench Press",
  "description": "Barbell bench press on a flat bench.",
  "video": "https://example.com/video",
  "equipment": "barbell",
  "minSets": 3,
  "maxSets": 5,
  "minReps": 8,
  "maxReps": 15,
  "minRestTime": 60,
  "maxRestTime": 120,
  "parentExerciseId": "123e4567-e89b-12d3-a456-426614174000",
  "muscleTarget": [
    "chest"
  ],
  "exerciseType": [
    "cardio"
  ],
  "instructions": [
    "Step 1: Position yourself",
    "Step 2: Execute the movement"
  ],
  "benefit": {
    "title": "Increases strength",
    "description": "Builds chest and triceps strength",
    "categories": [
      "Cardio",
      "Fuerza",
      "Resistencia"
    ]
  }
}
```

<h3 id="exercisescontroller_update-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string(uuid)|true|Exercise UUID|
|body|body|[ExerciseUpdate](#schemaexerciseupdate)|true|none|

> Example responses

> 200 Response

```json
{
  "success": true,
  "message": "Exercise updated successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Barbell Bench Press",
    "updatedAt": "2024-01-02T10:00:00Z"
  }
}
```

<h3 id="exercisescontroller_update-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Exercise updated successfully|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad Request - Validation error. Invalid field values|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized - No valid authentication token|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden - Only administrators can update exercises|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Exercise not found|None|

<h3 id="exercisescontroller_update-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## ExercisesController_remove

<a id="opIdExercisesController_remove"></a>



`DELETE /workout/exercises/{id}`

*Delete exercise*

Delete an exercise. Only accessible by users with ADMIN role.

<h3 id="exercisescontroller_remove-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string(uuid)|true|Exercise UUID|

> Example responses

> 204 Response

```json
{
  "success": true,
  "message": "Exercise deleted successfully"
}
```

<h3 id="exercisescontroller_remove-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Exercise deleted successfully|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized - No valid authentication token|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden - Only administrators can delete exercises|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Exercise not found|None|

<h3 id="exercisescontroller_remove-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

<h1 id="athletia-api-ai">AI</h1>

## AiController_generateExerciseDescription

<a id="opIdAiController_generateExerciseDescription"></a>



`POST /ai/generate-exercise`

*Generate exercise description using AI*

> Example responses

> 200 Response

```json
{
  "description": "Este es un ejercicio para trabajar el pecho..."
}
```

<h3 id="aicontroller_generateexercisedescription-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Exercise description generated successfully|Inline|

<h3 id="aicontroller_generateexercisedescription-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

# Schemas

<h2 id="tocS_ProfileRequest">ProfileRequest</h2>
<!-- backwards compatibility -->
<a id="schemaprofilerequest"></a>
<a id="schema_ProfileRequest"></a>
<a id="tocSprofilerequest"></a>
<a id="tocsprofilerequest"></a>

```json
{
  "name": "Jane Doe",
  "birthDate": "1990-01-01",
  "phoneNumber": "5512345678",
  "language": "spanish",
  "gender": "male",
  "fitGoals": [
    "weight_loss",
    "muscle_gain"
  ]
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|name|string|true|none|Full name|
|birthDate|string(date-time)|true|none|Birth date in ISO format (user must be 18+)|
|phoneNumber|string|true|none|10-digit phone number|
|language|string|true|none|Language preference - Valid values: english, spanish|
|gender|string|true|none|Gender - Valid values: male, female|
|fitGoals|[string]|true|none|Fitness goals - Valid values: weight_loss, muscle_gain, weight_maintenance, endurance, flexibility, general_fitness, rehabilitation, improved_posture, balance_and_coordination, cardiovascular_health, strength_training, athletic_performance, lifestyle_enhancement|

#### Enumerated Values

|Property|Value|
|---|---|
|language|english|
|language|spanish|
|gender|male|
|gender|female|

<h2 id="tocS_ChangePasswordRequest">ChangePasswordRequest</h2>
<!-- backwards compatibility -->
<a id="schemachangepasswordrequest"></a>
<a id="schema_ChangePasswordRequest"></a>
<a id="tocSchangepasswordrequest"></a>
<a id="tocschangepasswordrequest"></a>

```json
{
  "currentPassword": "OldP@ss123",
  "newPassword": "NewP@ss1234"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|currentPassword|string|true|none|Current password|
|newPassword|string|true|none|New password|

<h2 id="tocS_User">User</h2>
<!-- backwards compatibility -->
<a id="schemauser"></a>
<a id="schema_User"></a>
<a id="tocSuser"></a>
<a id="tocsuser"></a>

```json
{
  "email": "user@example.com",
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "state": "ACTIVE",
  "role": "user",
  "hasProfile": true,
  "name": "Jane Doe",
  "birthDate": "1990-01-01"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|email|string|true|none|User email|
|id|string|true|none|User ID|
|state|string|true|none|Account status - Valid values: ACTIVE, SUSPENDED, DEACTIVATED|
|role|string|true|none|Assigned role - Valid values: user, admin, moderator|
|hasProfile|boolean|true|none|Indicates if profile exists|
|name|object¦null|true|none|Full name|
|birthDate|object¦null|true|none|Birth date|

#### Enumerated Values

|Property|Value|
|---|---|
|state|ACTIVE|
|state|SUSPENDED|
|state|DEACTIVATED|
|role|user|
|role|admin|
|role|moderator|

<h2 id="tocS_LoginRequest">LoginRequest</h2>
<!-- backwards compatibility -->
<a id="schemaloginrequest"></a>
<a id="schema_LoginRequest"></a>
<a id="tocSloginrequest"></a>
<a id="tocsloginrequest"></a>

```json
{
  "email": "user@example.com",
  "password": "Str0ngP@ssw0rd"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|email|string(email)|true|none|User email|
|password|string|true|none|User password|

<h2 id="tocS_TokenResponse">TokenResponse</h2>
<!-- backwards compatibility -->
<a id="schematokenresponse"></a>
<a id="schema_TokenResponse"></a>
<a id="tocStokenresponse"></a>
<a id="tocstokenresponse"></a>

```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "accountId": "uuid"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|accessToken|string|true|none|JWT access token|
|refreshToken|string|true|none|JWT refresh token|
|accountId|string¦null|false|none|Account ID when applicable|

<h2 id="tocS_RegisterAccountRequest">RegisterAccountRequest</h2>
<!-- backwards compatibility -->
<a id="schemaregisteraccountrequest"></a>
<a id="schema_RegisterAccountRequest"></a>
<a id="tocSregisteraccountrequest"></a>
<a id="tocsregisteraccountrequest"></a>

```json
{
  "email": "user@example.com",
  "password": "Str0ngP@ssw0rd"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|email|string(email)|true|none|User email|
|password|string|true|none|Password (min 8 chars)|

<h2 id="tocS_ForgotPasswordRequest">ForgotPasswordRequest</h2>
<!-- backwards compatibility -->
<a id="schemaforgotpasswordrequest"></a>
<a id="schema_ForgotPasswordRequest"></a>
<a id="tocSforgotpasswordrequest"></a>
<a id="tocsforgotpasswordrequest"></a>

```json
{
  "email": "user@example.com"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|email|string(email)|true|none|User email|

<h2 id="tocS_ResetPasswordRequest">ResetPasswordRequest</h2>
<!-- backwards compatibility -->
<a id="schemaresetpasswordrequest"></a>
<a id="schema_ResetPasswordRequest"></a>
<a id="tocSresetpasswordrequest"></a>
<a id="tocsresetpasswordrequest"></a>

```json
{
  "token": "token123...",
  "newPassword": "NewP@ss1234"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|token|string|true|none|Reset token from email|
|newPassword|string|true|none|New password|

<h2 id="tocS_NotificationPreferencesDto">NotificationPreferencesDto</h2>
<!-- backwards compatibility -->
<a id="schemanotificationpreferencesdto"></a>
<a id="schema_NotificationPreferencesDto"></a>
<a id="tocSnotificationpreferencesdto"></a>
<a id="tocsnotificationpreferencesdto"></a>

```json
{
  "routines": true,
  "exercises": true,
  "system": true
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|routines|boolean|false|none|Receive routine notifications|
|exercises|boolean|false|none|Receive exercise notifications|
|system|boolean|false|none|Receive system notifications|

<h2 id="tocS_Profile">Profile</h2>
<!-- backwards compatibility -->
<a id="schemaprofile"></a>
<a id="schema_Profile"></a>
<a id="tocSprofile"></a>
<a id="tocsprofile"></a>

```json
{
  "name": "Jane Doe",
  "birthDate": "1990-01-01",
  "phoneNumber": "5512345678",
  "language": "spanish",
  "gender": "male",
  "fitGoals": [
    "weight_loss",
    "muscle_gain"
  ],
  "currentStreak": 5,
  "maxStreak": 10,
  "email": "user@example.com",
  "notificationPreferences": {
    "routines": true,
    "exercises": true,
    "system": true
  },
  "lastWeight": 75.5,
  "createdAt": "2024-01-01T12:00:00Z",
  "updatedAt": "2024-01-02T12:00:00Z",
  "age": 30
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|name|string|true|none|Full name|
|birthDate|string(date-time)|true|none|Birth date in ISO format|
|phoneNumber|string|true|none|10-digit phone number|
|language|string|true|none|Language preference - Valid values: english, spanish|
|gender|string|true|none|Gender - Valid values: male, female|
|fitGoals|[string]|true|none|Fitness goals - Valid values: weight_loss, muscle_gain, weight_maintenance, endurance, flexibility, general_fitness, rehabilitation, improved_posture, balance_and_coordination, cardiovascular_health, strength_training, athletic_performance, lifestyle_enhancement|
|currentStreak|number|true|none|Current streak of consecutive days|
|maxStreak|number|true|none|Maximum streak achieved|
|email|string|true|none|Associated email|
|notificationPreferences|[NotificationPreferencesDto](#schemanotificationpreferencesdto)|false|none|Notification preferences|
|lastWeight|number|false|none|Last recorded weight in kg|
|createdAt|string(date-time)|true|none|Creation date|
|updatedAt|string(date-time)|true|none|Last update date|
|age|number|true|none|Calculated age|

#### Enumerated Values

|Property|Value|
|---|---|
|language|english|
|language|spanish|
|gender|male|
|gender|female|

<h2 id="tocS_ProfileUpdate">ProfileUpdate</h2>
<!-- backwards compatibility -->
<a id="schemaprofileupdate"></a>
<a id="schema_ProfileUpdate"></a>
<a id="tocSprofileupdate"></a>
<a id="tocsprofileupdate"></a>

```json
{
  "name": "Jane Doe",
  "birthDate": "1990-01-01",
  "phoneNumber": "5512345678",
  "language": "spanish",
  "notificationPreferences": {
    "routines": true,
    "exercises": true,
    "system": true
  }
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|name|string|false|none|Full name|
|birthDate|string(date-time)|false|none|Birth date in ISO format (user must be 18+)|
|phoneNumber|string|false|none|10-digit phone number|
|language|string|false|none|Language preference - Valid values: english, spanish|
|notificationPreferences|[NotificationPreferencesDto](#schemanotificationpreferencesdto)|false|none|Notification preferences|

#### Enumerated Values

|Property|Value|
|---|---|
|language|english|
|language|spanish|

<h2 id="tocS_MeasurementRequest">MeasurementRequest</h2>
<!-- backwards compatibility -->
<a id="schemameasurementrequest"></a>
<a id="schema_MeasurementRequest"></a>
<a id="tocSmeasurementrequest"></a>
<a id="tocsmeasurementrequest"></a>

```json
{
  "weight": 75.5,
  "height": 180,
  "left_arm": 0,
  "right_arm": 0,
  "left_forearm": 0,
  "right_forearm": 0,
  "clavicular_width": 0,
  "neck_diameter": 0,
  "chest_size": 0,
  "back_width": 0,
  "hip_diameter": 0,
  "left_leg": 0,
  "right_leg": 0,
  "left_calve": 0,
  "right_calve": 0,
  "checkTime": "WEEKLY"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|weight|number|true|none|User weight in kg|
|height|number|true|none|User height in cm|
|left_arm|number|false|none|Left arm measurement in cm|
|right_arm|number|false|none|Right arm measurement in cm|
|left_forearm|number|false|none|Left forearm measurement in cm|
|right_forearm|number|false|none|Right forearm measurement in cm|
|clavicular_width|number|false|none|Clavicular width in cm|
|neck_diameter|number|false|none|Neck diameter in cm|
|chest_size|number|false|none|Chest size in cm|
|back_width|number|false|none|Back width in cm|
|hip_diameter|number|false|none|Hip diameter in cm|
|left_leg|number|false|none|Left leg measurement in cm|
|right_leg|number|false|none|Right leg measurement in cm|
|left_calve|number|false|none|Left calve measurement in cm|
|right_calve|number|false|none|Right calve measurement in cm|
|checkTime|string|true|none|Check time - Valid values: WEEKLY, MONTHLY, YEARLY|

#### Enumerated Values

|Property|Value|
|---|---|
|checkTime|WEEKLY|
|checkTime|MONTHLY|
|checkTime|YEARLY|

<h2 id="tocS_MeasurementUpdate">MeasurementUpdate</h2>
<!-- backwards compatibility -->
<a id="schemameasurementupdate"></a>
<a id="schema_MeasurementUpdate"></a>
<a id="tocSmeasurementupdate"></a>
<a id="tocsmeasurementupdate"></a>

```json
{
  "weight": 75.5,
  "height": 180,
  "left_arm": 0,
  "right_arm": 0,
  "left_forearm": 0,
  "right_forearm": 0,
  "clavicular_width": 0,
  "neck_diameter": 0,
  "chest_size": 0,
  "back_width": 0,
  "hip_diameter": 0,
  "left_leg": 0,
  "right_leg": 0,
  "left_calve": 0,
  "right_calve": 0,
  "checkTime": "WEEKLY"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|weight|number|false|none|User weight in kg|
|height|number|false|none|User height in cm|
|left_arm|number|false|none|Left arm measurement in cm|
|right_arm|number|false|none|Right arm measurement in cm|
|left_forearm|number|false|none|Left forearm measurement in cm|
|right_forearm|number|false|none|Right forearm measurement in cm|
|clavicular_width|number|false|none|Clavicular width in cm|
|neck_diameter|number|false|none|Neck diameter in cm|
|chest_size|number|false|none|Chest size in cm|
|back_width|number|false|none|Back width in cm|
|hip_diameter|number|false|none|Hip diameter in cm|
|left_leg|number|false|none|Left leg measurement in cm|
|right_leg|number|false|none|Right leg measurement in cm|
|left_calve|number|false|none|Left calve measurement in cm|
|right_calve|number|false|none|Right calve measurement in cm|
|checkTime|string|false|none|Check time - Valid values: WEEKLY, MONTHLY, YEARLY|

#### Enumerated Values

|Property|Value|
|---|---|
|checkTime|WEEKLY|
|checkTime|MONTHLY|
|checkTime|YEARLY|

<h2 id="tocS_Split">Split</h2>
<!-- backwards compatibility -->
<a id="schemasplit"></a>
<a id="schema_Split"></a>
<a id="tocSsplit"></a>
<a id="tocssplit"></a>

```json
{}

```

### Properties

*None*

<h2 id="tocS_SplitRequest">SplitRequest</h2>
<!-- backwards compatibility -->
<a id="schemasplitrequest"></a>
<a id="schema_SplitRequest"></a>
<a id="tocSsplitrequest"></a>
<a id="tocssplitrequest"></a>

```json
{
  "name": "Upper/Lower",
  "description": "4-day weekly program split into upper and lower.",
  "routineIds": [
    "497f6eca-6276-4993-bfeb-53cbbbba6f08"
  ],
  "trainingDays": [
    "Monday"
  ],
  "official": false
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|name|string|true|none|Split name|
|description|string|true|none|Split description|
|routineIds|[string]|false|none|Included routine IDs|
|trainingDays|[string]|true|none|Training days - Valid values: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday|
|official|boolean|true|none|Official split flag|

<h2 id="tocS_SplitUpdate">SplitUpdate</h2>
<!-- backwards compatibility -->
<a id="schemasplitupdate"></a>
<a id="schema_SplitUpdate"></a>
<a id="tocSsplitupdate"></a>
<a id="tocssplitupdate"></a>

```json
{
  "name": "string",
  "description": "stringstri",
  "routineIds": [
    "497f6eca-6276-4993-bfeb-53cbbbba6f08"
  ],
  "trainingDays": [
    "Monday"
  ],
  "official": false
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|name|string|false|none|Split name|
|description|string|false|none|Split description|
|routineIds|[string]|false|none|Included routine IDs|
|trainingDays|[string]|false|none|Training days|
|official|boolean|false|none|Official split flag|

<h2 id="tocS_RoutineRequest">RoutineRequest</h2>
<!-- backwards compatibility -->
<a id="schemaroutinerequest"></a>
<a id="schema_RoutineRequest"></a>
<a id="tocSroutinerequest"></a>
<a id="tocsroutinerequest"></a>

```json
{
  "name": "Upper/Lower Hypertrophy",
  "description": "4-day program focused on strength and hypertrophy.",
  "exerciseIds": [
    "497f6eca-6276-4993-bfeb-53cbbbba6f08"
  ],
  "routineGoal": [
    "weight_loss"
  ],
  "official": false
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|name|string|true|none|Routine name|
|description|string|true|none|Routine description|
|exerciseIds|[string]|false|none|Associated exercise IDs|
|routineGoal|[string]|true|none|Routine goals - Valid values: weight_loss, muscle_gain, weight_maintenance, endurance, flexibility, general_fitness, rehabilitation, improved_posture, balance_and_coordination, cardiovascular_health, strength_training, athletic_performance, lifestyle_enhancement|
|official|boolean|true|none|Official routine flag|

<h2 id="tocS_RoutineUpdate">RoutineUpdate</h2>
<!-- backwards compatibility -->
<a id="schemaroutineupdate"></a>
<a id="schema_RoutineUpdate"></a>
<a id="tocSroutineupdate"></a>
<a id="tocsroutineupdate"></a>

```json
{
  "name": "Upper/Lower Hypertrophy",
  "description": "stringstri",
  "exerciseIds": [
    "497f6eca-6276-4993-bfeb-53cbbbba6f08"
  ],
  "routineGoal": [
    "weight_loss"
  ],
  "official": false
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|name|string|false|none|Routine name|
|description|string|false|none|Routine description|
|exerciseIds|[string]|false|none|Associated exercise IDs|
|routineGoal|[string]|false|none|Routine goals|
|official|boolean|false|none|Official routine flag|

<h2 id="tocS_ExerciseRequest">ExerciseRequest</h2>
<!-- backwards compatibility -->
<a id="schemaexerciserequest"></a>
<a id="schema_ExerciseRequest"></a>
<a id="tocSexerciserequest"></a>
<a id="tocsexerciserequest"></a>

```json
{
  "name": "Bench Press",
  "description": "Barbell bench press on a flat bench.",
  "equipment": "barbell",
  "parentExerciseId": "123e4567-e89b-12d3-a456-426614174000",
  "video": "https://example.com/video",
  "minSets": 3,
  "maxSets": 5,
  "minReps": 8,
  "maxReps": 15,
  "minRestTime": 60,
  "maxRestTime": 120,
  "muscleTarget": [
    "chest"
  ],
  "exerciseType": [
    "cardio"
  ],
  "instructions": [
    "Step 1: Position yourself",
    "Step 2: Execute the movement"
  ],
  "benefit": {
    "title": "Increases strength",
    "description": "Builds chest and triceps strength",
    "categories": [
      "Cardio",
      "Fuerza",
      "Resistencia"
    ]
  }
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|name|string|true|none|Exercise name|
|description|string|true|none|Exercise description|
|equipment|string|true|none|Equipment required for the exercise - Valid values: barbell, dumbbell, machine, bodyweight, kettlebell, resistance_band, cable, other|
|parentExerciseId|string(uuid)|false|none|Parent exercise ID if this is a variant|
|video|string|true|none|Demo video URL|
|minSets|number|true|none|Minimum sets|
|maxSets|number|true|none|Maximum sets|
|minReps|number|true|none|Minimum reps|
|maxReps|number|true|none|Maximum reps|
|minRestTime|number|true|none|Minimum rest time in seconds|
|maxRestTime|number|true|none|Maximum rest time in seconds|
|muscleTarget|[string]|true|none|Target muscles - Valid values: chest, core, trapezius, lats, deltoids, triceps, biceps, forearms, quads, hamstrings, glutes, adductors, calves, neck|
|exerciseType|[string]|true|none|Exercise types - Valid values: cardio, strength, flexibility, hiit, pilates, yoga, crossfit, calisthenics, aerobics, endurance, powerlifting, olympic_weightlifting, bodybuilding, functional_training, rehabilitation, sports_specific, warm_up, cool_down|
|instructions|[string]|false|none|Exercise instructions (steps)|
|benefit|object|false|none|Exercise benefit information|

#### Enumerated Values

|Property|Value|
|---|---|
|equipment|barbell|
|equipment|dumbbell|
|equipment|machine|
|equipment|bodyweight|
|equipment|kettlebell|
|equipment|resistance_band|
|equipment|cable|
|equipment|other|

<h2 id="tocS_ExerciseUpdate">ExerciseUpdate</h2>
<!-- backwards compatibility -->
<a id="schemaexerciseupdate"></a>
<a id="schema_ExerciseUpdate"></a>
<a id="tocSexerciseupdate"></a>
<a id="tocsexerciseupdate"></a>

```json
{
  "name": "Bench Press",
  "description": "Barbell bench press on a flat bench.",
  "video": "https://example.com/video",
  "equipment": "barbell",
  "minSets": 3,
  "maxSets": 5,
  "minReps": 8,
  "maxReps": 15,
  "minRestTime": 60,
  "maxRestTime": 120,
  "parentExerciseId": "123e4567-e89b-12d3-a456-426614174000",
  "muscleTarget": [
    "chest"
  ],
  "exerciseType": [
    "cardio"
  ],
  "instructions": [
    "Step 1: Position yourself",
    "Step 2: Execute the movement"
  ],
  "benefit": {
    "title": "Increases strength",
    "description": "Builds chest and triceps strength",
    "categories": [
      "Cardio",
      "Fuerza",
      "Resistencia"
    ]
  }
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|name|string|false|none|Exercise name|
|description|string|false|none|Exercise description|
|video|string|false|none|Demo video URL|
|equipment|string|false|none|Equipment required for the exercise|
|minSets|number|false|none|Minimum sets|
|maxSets|number|false|none|Maximum sets|
|minReps|number|false|none|Minimum reps|
|maxReps|number|false|none|Maximum reps|
|minRestTime|number|false|none|Minimum rest time in seconds|
|maxRestTime|number|false|none|Maximum rest time in seconds|
|parentExerciseId|string(uuid)|false|none|Parent exercise ID if this is a variant|
|muscleTarget|[string]|false|none|Target muscles|
|exerciseType|[string]|false|none|Exercise types|
|instructions|[string]|false|none|Exercise instructions (steps)|
|benefit|object|false|none|Exercise benefit information|

#### Enumerated Values

|Property|Value|
|---|---|
|equipment|barbell|
|equipment|dumbbell|
|equipment|machine|
|equipment|bodyweight|
|equipment|kettlebell|
|equipment|resistance_band|
|equipment|cable|
|equipment|other|

