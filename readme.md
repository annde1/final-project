# Zen Fit Backend

Welcome to the backend side of the Zen Fit project! Below you will find an overview of the routes and the technologies used in this backend application.

## Routes

### Exercise Routes (`exercisesRouter`)

- **GET /api/exercises**: Retrieves all exercises. Requires authentication.

### Template Routes (`templateRouter`)

- **POST /api/templates**: Creates a new template. Requires premium membership and authentication.
- **GET /api/templates/random-templates**: Retrieves 6 random templates for the homepage.
- **GET /api/templates**: Retrieves all templates. Requires admin privileges.
- **GET /api/templates/my-templates**: Retrieves all templates of the logged-in user. Requires authentication.
- **DELETE /api/templates/:id**: Deletes a user's template. Requires ownership or admin privileges.
- **PUT /api/templates/:id**: Updates a template. Requires ownership or admin privileges.
- **GET /api/templates/:id**: Retrieves a template by its ID.

### User Routes (`usersRouter`)

- **GET /api/users/following**: Retrieves users followed by the logged-in user. Requires authentication.
- **GET /api/users/followers**: Retrieves followers of the logged-in user. Requires authentication.
- **POST /api/users**: Creates a new user.
- **POST /api/users/login**: Logs in a user.
- **DELETE /api/users/:id**: Deletes a user. Requires ownership or admin privileges.
- **PATCH /api/users/:id**: Updates the premium status of a user. Requires ownership or admin privileges.
- **PUT /api/users/:id**: Edits user details. Requires user authentication.
- **GET /api/users**: Searches for users. Requires authentication.
- **PATCH /api/users/follow/:id**: Follows a user. Requires authentication.
- **PATCH /api/users/unfollow/:id**: Unfollows a user. Requires authentication.
- **GET /api/users/:id**: Retrieves a user by ID. Requires authentication.

### Workout Routes (`workoutRouter`)

- **POST /api/workouts**: Creates a new workout. Requires premium membership and authentication.
- **DELETE /api/workouts/:id**: Deletes a workout. Requires ownership or admin privileges.
- **GET /api/workouts**: Retrieves all workouts. Requires admin privileges.
- **GET /api/workouts/feeds**: Retrieves workout feeds based on filters. Requires authentication.
- **GET /api/workouts/:id**: Retrieves workouts by user ID.
- **GET /api/workouts/my-workouts**: Retrieves all workouts of the logged-in user. Requires authentication.
- **PUT /api/workouts/:id**: Updates a workout. Requires ownership or admin privileges.
- **PATCH /api/workouts/:id**: Likes a workout. Requires authentication.

## Technologies Used

- TypeScript (ts)
- Bcrypt (bcrypt)
- CORS (cors)
- Express (express)
- Multer for file upload
- Firebase for file storage
- Joi for validation
- JSON Web Token (JWT)
- Morgan logger
- Winston logger

## Running the App

npm run watch

This backend application is built using TypeScript for type safety, Express for handling HTTP requests, Firebase for file storage, and various middleware for authentication, authorization, and request validation.

Feel free to explore the routes and technologies used in this backend application to understand how Zen Fit operates behind the scenes. If you have any questions or encounter any issues, don't hesitate to reach out for assistance.
