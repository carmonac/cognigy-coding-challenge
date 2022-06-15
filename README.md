![CI workflow](https://github.com/carmonac/cognigy-coding-challenge/actions/workflows/build-and-test.yml/badge.svg)

# cognigy coding challenge (Car API)

## Introduction

This is the repository with the technical test about Cars for the position of senior backend developer. It contains a nodejs app written in **TypeScript** which implements an API to perform CRUD operations against a MongoDB database.The app has been developed using TDD and almost every file has its corresponding spec file.

## How to setup
To install dependencies

	npm install

	
Start the app
	
	npm start


Run test

	npm run test
	
Run only unit tests

	npm run test:unit
	
Run only integration tests

	npm run test:integration
	

Docker Compose

	docker-compose up --detach
	
##Endpoint definitions
### Swagger
Once the app is running visit the next url to see the swagger page

[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

###Postman

You can find a postman json file calle `cars_api.postman_collection.json` that can be imported in your postman app, this file contains the collection of endpoints for interacting with the API

## Authentication
All endpoints under `/cars` are protected by X-API-KEY with the default password `cognigy.ai_123`

**Note**: In swagger you will have to set the password clicking in the button Authorize. Postman collection already contains the password in the header.

## Features
### Linter
eslint is being used as linter since tslint is deprecated and it is recommended to use it for typescript development. It's following the standard rules and also extends with prettier to format the code.


### Schema validation
For schema validation it's used AJV package. You will have to considerate the next requirement for data validation:

- **id** is type string and match with pattern "^[0-9a-fA-F]{24}$"
- **color** is type string
- **model** is type string
- **year** is type number and cannot be greater than actual year
- **brand** is type string
- **hp** is type number and has to be minimum 30 and maximum 500
- **price** is type number with a minimum of 1000

### Cache
For cache it's used the module **apicache** which uses memory storage by default (used in this project) for rapid access to data. This package is a good options because it has support for Redis in case we want to apply a distributed cache.

It was applied only in `GET`endpoints but **right now is disabled** for testing porposes. If you want to enable it, you just need to set the env variable `CACHE_ENABLED=true`

### Database
We are using lastest version of MongoDB and mongoose to connect and perform operations.
### Express
Express is a minimal and flexible Node.js web application framework and this project is coded on top of it. Version 4 has been used.

### Other middleware
- **Helmet**: it helps you secure your Express apps by setting various HTTP headers.
- **Cors**: is a node.js package for providing a middleware that can be used to enable CORS.
- **Compression**: middleware to compress response bodies
- **Morgan**: morgan is a configurable logger for requests.

### Logs
Log4js is used to log useful messages through the application


## Project description
### Architecture
The way that was developed provides a layer of abstraction on top of express, which means it's easier to scalate, add new features and keep simplicity. The followed architectural pattern helps to resolve spaghetti code and define a structure to write new funcionalities. It's highly inspired in frameworks like [NestJS](https://nestjs.com/) or libraries like [routing-controller](https://github.com/typestack/routing-controllers) or [tsoa](https://github.com/lukeautry/tsoa).

### Decorator pattern

The decorator pattern is widely used to extend the functionality of classes and methods. In this project TypeScript decorators and metaprogramming are used and there are the following types of decorators:

- **@Controller()** used to define a new controller with its routes, receive the paremeter of the parent path.
- **@Get()** is applied to methods to indicate that it's going to receive a GET request, receive a subpath as paremeter
- **@Post()** is applied to methods to indicate that it's going to receive a POST request, receive a subpath as paremeter
- **@Delete()** is applied to methods to indicate that it's going to receive a DELETE request, receive a subpath as paremeter
- **@Patch()** is applied to methods to indicate that it's going to receive a PATCH request, receive a subpath as paremeter
- **@Middleware()** is applied to methods or classes and receive a middleware function which have effect in the corresponding decorated item.
- **@Injectable()** is neccesary to mark classes as injectable class that means that can receive dependency injection.

### Dependency injection

Dependency injection is a design pattern in which an object receives other objects that it depends on. A form of inversion of control, dependency injection aims to separate the concerns of constructing objects and using them, leading to loosely coupled programs. The pattern ensures that an object which wants to use a given service should not have to know how to construct those services. Instead, the receiving object (or 'client') is provided with its dependencies by external code (an 'injector'), which it is not aware of.

All classes to be injected need to be registered in the container and injected by the core app. It will be explained in details in the next sections.

### Repository pattern

The repository pattern is a strategy for abstracting data access. So, to dicect that a bit, data access is made up of the code in an application that deals with storing and retrieving data. In the project we work with repositories which represent the layer which takes care and provides logic to access data stores in persistent storage (MongoDB). In this pattern we have a baseRepository that will be in charge of the basic operations with the database and from which the rest of the repository classes will inherit.

## Folder structure and files

* root
	* **controllers** *this folder contains the controllers of the app*
	* **decorators** *this folder contains the decorators necessary to define controllers, routes, injections and middleware*
	* **interfaces** *folder with definitions of some interfaces used in the app*
	* **middleware** *here there are middleware functions for express*
	* **repositories** *this folder contains the clases in charge to perform operations in the database*
	* **schema** *contains the definition schemas for mongoose and ajv*
	* **services** *contains the service files which can be injected in controller to make operations*
	* **utils** *contains different utilities needed in the app*
	* app.ts *is the core of the app, contains the SeverApp class in charge of configure the whole app (Routes, injections...)*
	* config.ts *contains the config values*
	* db.connection.ts *is the class in charge of stablish the connection with mongodb*
	* index.ts *entry point*
	* server.ts *is where ServerApp is instantiate and configured with the global middleware, controllers and providers*



## How to extend functionality
### Create a new Controller

Create in a new file called test.controller.ts in controllers folder

```
    @Controller("/test")
    class TestController {
    	@Get("/:id)
    	public testMethod(req: Request, res: Response) {
    		res.json({ message: `I got ${req.params.id} as param` })
    	}
    }
```
And to make it works we need to configure in server.ts in the ServerApp constructor

```
  let app = new ServerApp({
    globalMiddleware: [],
    controllers: [TestController],
    providers: [],
  });
```

### Create a new Service
Create a new file called test.service.ts in services folder

```
class TestService {
  hello(): string {
    return "hello";
  }
}
```

Add to our app in providers

```
  let app = new ServerApp({
    globalMiddleware: [],
    controllers: [TestController],
    providers: [TestService],
  });
```

Now you can apply it to the controller

```
@Controller("/test")
@Injectable()
class TestController {
	private testService: TestService;
	
	constructor(testService: TestService) {
		this.testService = testService;
	}

	@Get("/:id)
	public testMethod(req: Request, res: Response) {
		res.json({ message: `${this.testService.hello()} from service` })
	}
}
```
### Create a new Middleware

In middleware folder create testimer.middleware.ts with the next content

```
export const testTimer = (req: Request, res: Response, next: NextFunction) => {
 const startHrTime = process.hrtime();

  res.on("finish", () => {
    const elapsedHrTime = process.hrtime(startHrTime);
    const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
    console.log("%s : %fms", req.path, elapsedTimeInMs);
  });

  next();
};
```

Apply it in your controller

```
@Controller("/test")
@Injectable()
@Middleware(testTimer)
class TestController {
	private testService: TestService;
	
	constructor(testService: TestService) {
		this.testService = testService;
	}

	@Get("/:id)
	public testMethod(req: Request, res: Response) {
		res.json({ message: `${this.testService.hello()} from service` })
	}
}
```

### Create a new Repository

Let's have a repository to save our test entity. Create a file called test.repository.ts in repositories folder. Remember to create a new schema (TestSchema) and interface which extends from mongoose.Document (ITest) for test

```
export class TestRepository extends BaseRepository<ITest> {
  constructor() {
    super("Test", TestSchema);
  }
}
```

We need to add it in providers in our ServerApp

```
  let app = new ServerApp({
    globalMiddleware: [],
    controllers: [TestController],
    providers: [TestRepository, TestService],
  });
```

Let's save a new document in our test collection in mongodb from TestService class


```
@Injectable()
class TestService {
  testRepository: TestRepository;
  
  constructor(testRepository: TestRepository) {
      this.testRepository = testRepository;
  }
  
  async public saveTestEntity(test: ITest) {
  	  await this.testRepository.save(test);
  }

  hello(): string {
      return "hello";
  }
  
}
```