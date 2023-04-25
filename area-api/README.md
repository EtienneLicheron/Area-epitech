## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# API Reference

## **Local Authentication**

### **-** Login user

```http
  POST /auth/login
```

#### BODY

| Parameter  | Type   | Required |
|:-----------|:-------|:---------|
| `email`    | string | **True** |
| `password` | string | **True** |

### **-** Register user

```http
  POST /auth/register
```

#### BODY

| Parameter  | Type   | Required |
|:-----------|:-------|:---------|
| `username` | string | **True** |
| `email`    | string | **True** |
| `password` | string | **True** |

## **External Application Authentication / Link**

### **-** Link GitHub application
**Optional authentication (for the link with the local account)**

```http
  REDIRECT /auth/github
```

### **-** Link Twitter application
**Optional authentication (for the link with the local account)**

```http
  REDIRECT /auth/twitter
```

### **-** Link Microsoft application
**Optional authentication (for the link with the local account)**

```http
  REDIRECT /auth/microsoft
```

### **-** Link Google application
**Optional authentication (for the link with the local account)**

```http
  REDIRECT /auth/google
```

### **-** Link Twitch application
**Optional authentication (for the link with the local account)**

```http
  REDIRECT /auth/twitch
```

### **-** Link Hue application
**Authentication required**

```http
  REDIRECT /auth/hue
```

### **-** Link / Update Tekme application
**Authentication required**

```http
  POST /applications/tekme
```
#### BODY

| Parameter | Type   | Required | Value          |
|:--------- |:-------|:---------|:---------------|
| `token`   | string | **True** | (access token) |

### **-** Remove application
**Authentication required**

```http
  DELETE /application/:name
```

## **User**

### **-** Get user information
**Authentication required**

```http
  GET /
```

### **-** Update user information
**Authentication required**

```http
  PUT /
```
#### BODY

| Parameter  | Type   | Required  |
|:-----------|:-------|:----------|
| `username` | string | **False** |
| `email`    | string | **False** |
| `password` | string | **False** |

### **-** Remove user
**Authentication required**

```http
  DELETE /
```

## **Webhooks**

### **-** Remove webhook
**Authentication required**

```http
  DELETE /webhooks/:id
```

## **GitHub Webhooks**

### **-** Get GitHub repositories for webhooks
**Authentication required & GitHub application link**

```http
  GET /webhooks/github/repositories
```

#### QUERY

| Parameter  | Type   | Required  | Default |
|:-----------|:-------|:----------|:--------|
| `page`     | number | **False** | 1       |
| `per_page` | number | **False** | 100     |

### **-** Get available GitHub events for webhooks repository
**Authentication required & GitHub application link**

```http
  GET /webhooks/github/events/:repository
```

### **-** Create GitHub webhook
**Authentication required & GitHub application link**

```http
  POST /webhooks/github
```

#### BODY

| Parameter    | Type   | Required | Value                          |
|:-------------|:-------|:---------|:-------------------------------|
| `repository` | string | **True** | (name of github repository)    |
| `event`      | string | **True** | (name of github webhook event) |

## **Microsoft Webhooks**

### **-** Get Microsoft services for webhooks
**Authentication required & Microsoft application link**

```http
  GET /webhooks/microsoft/services
```
### **-** Create Microsoft webhook
**Authentication required & Microsoft application link**

```http
  POST /webhooks/microsoft
```
#### BODY

| Parameter    | Type   | Required | Value                          |
|:-------------|:-------|:---------|:-------------------------------|
| `service` | string | **True** | (title of service)    |
| `event`      | string | **True** | (title of event)

## **Actions**

### **-** Remove action
**Authentication required**

```http
  DELETE /actions/:id
```

## **Hue Actions**

### **-** Get Hue available lights
**Authentication required & Hue application link**

```http
  GET /actions/hue/lights
```

### **-** Get Hue light information
**Authentication required & Hue application link**

```http
  GET /actions/hue/lights/:external
```

### **-** Get Hue available scenes
**Authentication required & Hue application link**

```http
  GET /actions/hue/scenes
```

### **-** Get Hue scene information
**Authentication required & Hue application link**

```http
  GET /actions/hue/scenes/:external
```

### **-** Create Hue action
**Authentication required & Hue application link**

```http
  POST /actions/hue
```

#### BODY

| Parameter   | Type   | Required | Value                                                |
|:------------|:-------|:---------|:-----------------------------------------------------|
| `type`      | string | **True** | light / scene                                        |
| `action`    | string | **True** | on / off                                             |
| `external`  | string | **True** | (light or scene id)                                  |
| `webhook`   | number | **True** | (webhook id)                                         |
| `countdown` | number | **True** | (time in seconds before the execution of the action) |

## **Twitter Actions**

### **-** Create Twitter action
**Authentication required & Twitter application link**

```http
  POST /actions/twitter
```

#### BODY

| Parameter   | Type   | Required | Value                                                |
|:------------|:-------|:---------|:-----------------------------------------------------|
| `message`   | string | **True** | (tweet)                                              |
| `webhook`   | number | **True** | (webhook id)                                         |
| `countdown` | number | **True** | (time in seconds before the execution of the action) |

## **Tekme Actions**

### **-** Get Tekme available doors
**Authentication required & Tekme application link**

```http
  GET /actions/tekme/doors
```

### **-** Create Tekme action
**Authentication required & Tekme application link**

```http
  POST /actions/tekme
```

#### BODY

| Parameter   | Type   | Required | Value                                                         |
|:------------|:-------|:---------|:--------------------------------------------------------------|
| `door`      | string | **True** | HUB / 4eme / Foyer / Meetup / SM1 / SM2 / Stream / Admissions |
| `webhook`   | number | **True** | (webhook id)                                                  |
| `countdown` | number | **True** | (time in seconds before the execution of the action)          |

## **Gmail Actions**

### **-** Create Gmail action
**Authentication required & Google application link**

```http
  POST /actions/gmail
```

#### BODY

| Parameter     | Type   | Required | Value                                                         |
|:--------------|:-------|:---------|:--------------------------------------------------------------|
| `destination` | string | **True** | (destination for email)                                       |
| `subject`     | string | **True** | (email subject)                                               |
| `message`     | string | **True** | (email message)                                               |
| `webhook`     | number | **True** | (webhook id)                                                  |
| `countdown`   | number | **True** | (time in seconds before the execution of the action)          |

## **Outlook Actions**

### **-** Create Outlook action
**Authentication required & Microsoft application link**

```http
  POST /actions/outlook
```

#### BODY

| Parameter     | Type   | Required | Value                                                         |
|:--------------|:-------|:---------|:--------------------------------------------------------------|
| `destination` | string | **True** | (destination for email)                                       |
| `subject`     | string | **True** | (email subject)                                               |
| `message`     | string | **True** | (email message)                                               |
| `webhook`     | number | **True** | (webhook id)                                                  |
| `countdown`   | number | **True** | (time in seconds before the execution of the action)          |

## **Todo Actions**

### **-** Get Todo lists
**Authentication required & Microsoft application link**

```http
  GET /actions/todo/lists
```

### **-** Create Todo action
**Authentication required & Microsoft application link**

```http
  POST /actions/todo
```

#### BODY

| Parameter   | Type   | Required | Value                                                |
|:------------|:-------|:---------|:-----------------------------------------------------|
| `task`      | string | **True** | (task title)                                         |
| `external`  | string | **True** | (external list id)                                   |
| `webhook`   | number | **True** | (webhook id)                                         |
| `countdown` | number | **True** | (time in seconds before the execution of the action) |

## **Calendar Actions**

### **-** Create Calendar action
**Authentication required & Microsoft application link**

```http
  POST /actions/calendar
```

#### BODY

| Parameter   | Type   | Required | Value                                                |
|:------------|:-------|:---------|:-----------------------------------------------------|
| `title`     | string | **True** | (event title)                                        |
| `webhook`   | number | **True** | (webhook id)                                         |
| `countdown` | number | **True** | (time in seconds before the execution of the action) |

## **Agenda Actions**

### **-** Create Agenda action
**Authentication required & Google application link**

```http
  POST /actions/agenda
```

#### BODY

| Parameter   | Type   | Required | Value                                                |
|:------------|:-------|:---------|:-----------------------------------------------------|
| `title`     | string | **True** | (event title)                                        |
| `webhook`   | number | **True** | (webhook id)                                         |
| `countdown` | number | **True** | (time in seconds before the execution of the action) |
