
## Tech Stack
**Language:** TypeScript

**Web Application:** React

**Mobile Application:** React Native

**API:** NestJS

**Server:** Node, Nginx

**Database:** PostgreSQL



### TypeScript

TypeScript is a popular superset of JavaScript that adds optional static typing and other features to the language. Using TypeScript in a React web application can provide several benefits, including :

* Improved productivity: TypeScript's static typing can help catch errors early in the development process, reducing the need for debugging and increasing developer productivity.

* Better code maintainability: TypeScript's type system can make it easier to understand and maintain existing code, especially in large codebases.

* Improved code quality: TypeScript's type system can help ensure that the code adheres to a certain level of quality, making it less prone to bugs and more predictable.

### React

React is a JavaScript library for building user interfaces. It is widely used for building complex and large web applications due to its flexibility, performance, and ease of use. Some of the reasons why we chose to use React :

* Component-based architecture: React allows developers to build applications using a component-based architecture, which makes it easy to reason about and manage the application's state and UI.

* Virtual DOM: React uses a virtual DOM, which optimizes updates to the actual DOM and improves the performance of the application.

* JSX: React uses JSX, a syntax extension for JavaScript, which makes it easy to express the structure of a component's UI.

* Reusable components: React encourages the use of reusable components, which can be shared across different parts of the application, reducing the amount of code needed to be written.

### React Native

React Native is a framework for building mobile applications using React. It allows developers to use the same codebase for building apps for both iOS and Android platforms. We are making the website with React so we logically chose React Native for a homogeneous cross-platform mobile application according to the website.

### NestJS

NestJS is a web framework for building scalable and efficient server-side applications using JavaScript and TypeScript. It can be beneficial for a React or React Native application in several ways:

* Based on Express.js: NestJS is built on top of Express.js, which is a popular and well-documented framework for building web applications in Node.js. This makes it easy for us familiar with Express to quickly get up to speed with NestJS.

* Modularity: NestJS uses a modular architecture, which makes it easy to organize and maintain the codebase of our application. This can improve the scalability and maintainability of the application.

* TypeScript Support: NestJS is written in TypeScript and it fully supports it, which can provide a better development experience for the developers who are familiar with it.

* Decorators: NestJS uses decorators, which are a feature of TypeScript, to define controllers, providers and pipes. This can make it easy to define and manage the different parts of our application.

### Node

Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. It allows us to run JavaScript on the server side, which can be beneficial for our React and React Native application in several ways:

* Consistency: Node.js allows for the use of the same language (JavaScript) on both the client and server sides, which can simplify development and make it easier for a team to work on both parts of the application.

* Package Management: Node.js comes with npm (Node Package Manager), which is a powerful tool for managing dependencies and downloading packages. This can save time and make it easier to integrate third-party libraries into your application.

* Performance: Node.js is known for its fast performance, thanks to its use of an event-driven, non-blocking I/O model. This can make it well-suited for real-time applications, such as those built with React Native.

### Nginx

NGINX is a web server and reverse proxy server. It is known for its high performance and low resource usage, and can be beneficial for a React or React Native application in several ways :

* High Performance: NGINX is known for its high performance and ability to handle a large number of concurrent connections. This can help ensure that your application remains responsive even under heavy load.

* Reverse Proxy: NGINX can act as a reverse proxy, allowing it to forward incoming requests to other servers or services. This can be useful for routing requests to different parts of our application, or for load balancing between multiple servers.

* Load Balancing: NGINX has built-in support for load balancing, which can help distribute requests across multiple servers and improve the overall performance of our application.

* Caching: NGINX can act as a caching proxy, which can improve the performance of our application by caching commonly requested resources.

* Security: NGINX can be configured to provide various security features such as SSL termination, rate limiting, and blocking of malicious requests which can protect your application from various types of attack.

* Scalability: NGINX can be easily deployed in a clustered environment, which can help us to scale our application horizontally.

### PostgreSQL

PostgreSQL is a powerful, open-source object-relational database management system (ORDBMS) that can be beneficial for our React/React Native application in several ways:

* PostgreSQL is a powerful, open-source object-relational database management system (ORDBMS) that can be beneficial for a React or React Native application in several ways:

* SQL support: PostgreSQL supports a wide variety of SQL features, such as transactions, indexes, and views, which can simplify the development and maintenance of your application's data layer.

* Concurrency: PostgreSQL has built-in support for multi-version concurrency control (MVCC), which allows multiple transactions to access the same data at the same time without blocking each other. 

* Scalability: PostgreSQL can handle large amounts of data and handle high levels of concurrency, making it well-suited for applications that need to scale horizontally.

* Data Integrity: PostgreSQL provides various constraint like primary key, foreign key, unique, check to maintain the integrity of data and to avoid the data inconsistencies.

## Technology comparison

- Bdd:
We took Postgresql because it uses structured SQL, so we had the choice between Postgresql and MariaDB which are the best known in the field. And we chose Postgresql because we needed a relationship between tables which is a very powerful point on Postgresql.

- Api:
For the backent we chose NestJS because it uses everything from the TS as the frontend. But also because we knew we could do whatever we wanted with it. NestJS is an express overlay which facilitates its development.

- Web:
We chose React JS beacause we are making the mobile application with React Native, those two techno works the same way were other frameworks don’t, for example you can’t make a mobile application with Vue nor Angular.

- Mobile:
We chose react native as techno with expo and typescript because I already know this technology, and it's faster to develop than to learn a new techno (eg flutter). We use expo because it allows us to perform tests much faster on the application without having to rebuild it with each modification. And I use typescript because it is clearer than js in terms of variable types.

## Allocation of tasks

- [@EtienneLicheron](https://github.com/EtienneLicheron) - Web Application with ReactJS
- [@BenjaminVic](https://github.com/Benjamin-Vic) - API with NestJS
- [@SebastienPhelip](https://github.com/seb34000) - Mobile Application with React Native
- [@LaurentAmat](https://github.com/Lqvrent) - Project build with Docker


