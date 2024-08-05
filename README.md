# Task Scheduler Microservice

## Installation

1. Clone the repository:

   ```bash
    $ git clone git@github.com:mehdi753/task-scheduler.git
    $ cd job-scheduler
   ```

2. Install dependencies:

   ```bash
    $ yarn
   ```

3. Set up environment variables:

   ```bash
    $ mv .env.example .env
   ```

4. Start the application:

   1. Yarn:

      ```bash
        $ yarn run start:dev
      ```

   2. Docker:

      ```bash
        $ docker swarm init # if node is not already part of swarm
        $ docker stack deploy --compose-file docker-compose.yml task-scheduler
      ```

Access Swagger documentation at http://localhost:3500/docs.
