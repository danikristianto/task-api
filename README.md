# task-api

In this application is an basic API for task manager. This API provided features to creating user, login, update, delete account
and upload profile image/avatar and a basic CRUD operation for task by user logged in. <br> <br>

in this API using:
- **express** _as web framework_
- **mongodb** _for database_
- **mongoose** _for mongodb object modeling_
- **bcryptjs** _to encrypt password_
- **jsonwebtoken** _for authentication_
- **@sendgrid/mail** _for sending email_
- **multer** _for uploading files_
- **sharp** _to rezise image_
- **validator** _for validating input_

### URL Endpoint
URL : https://dani-task-api.herokuapp.com <br>

**User Section**
| Description | Method | Endpoint | Body |
| --- | --- | --- | --- |
| **Creating user** | POST | URL/users | {"name" : "example","email" : "validemail@gmail.com", "password" : "example123"} |
| **Login** | POST | URL/users/login | { "name" : "example", "email" : "example123@gmail.com" } |
| **Logout** | POST | URL/users/logout |  |
| **Upload Avatar** | POST | URL/users/me/avatar | _form-data_ key: avatar |
| **Delete Avatar** | DELETE | URL/users/me/avatar |  |
| **Show all user** | GET | URL/users |  |
| **Show profile** | GET | URL/users/me |  |
| **Update profile** | PATCH | URL/users/me | {"name" : "example", "email" : "validemail@gmail.com", "password" : "example1", "age" : 20} |
| **Delete account** | DELETE | URL/users/me |  |

**Task Section**
| Description | Method | Endpoint | Body |
| --- | --- | --- | --- |
| **Creating task** | POST | URL/tasks | {"description" : "example", "completed" : true} |
| **Show all tasks** | GET | URL/tasks | |
| **Show Detail tasks** | GET | URL/tasks/:idtask | |
| **Update task** | PATCH | URL/tasks/:idtask | {"description" : "example", "completed" : false} |
| **Delete task** | DELETE | URL/tasks/:idtask | |

_note: please login first before using other endpoint. <br>
Enjoy it!_ :octocat:
