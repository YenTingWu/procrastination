## Server & Cloud

###### TypeORM

TypeORM is an **Object Relational Mapper** library running in node.js. It supports javscript and typescript.

I have not much experience with ORM and SQL. It was really confusing for me that people used different apis in this library to do literally the same thing. I didn't know what I should follow, so whatever was workable was fine for me and both patterns are in my codebase now. Apprentlly, I didn't read the doc clearly. While writing this article, I found out there are two different patterns, [Active Record and Data Mapper](https://typeorm.io/#/active-record-data-mapper/which-one-should-i-choose).

This is my first time using ORM. I've only used Knex as database before and I think:

- **More Declarative** -
  The **virtual object database** is really helpful for me to read the code.

- **Less Complexity** -
  When using Knex, it was a lot of nested functions whereas ORM is much clearer for me to understand which column I'm working on.

But I actually don't like TypeORM because of the lack of docs. [Prisma](https://www.prisma.io/) might be the next ORM I would like to play around with.

###### Digital Ocean

I had no CS background and never fully understood what memory or disk is. Also, I had been curious about how it cost for running a cloud server. Due to the reason above, I tried to run a server instead of using serverless database.

At first, I ran a 1GB of RAM droplets for my server and DB. While setting up, I surprisely found out that it already cost 1.3GB for only my node server code. And I changed the project to 2GB of RAM. But after storing some data into DB, RAM issues came out again.

I'm still figuring out what is the best solution for me. Currently my take away is not put DB in the droplet. It's kind of ridiculous.

###### Docker

When starting approaching web developement, I kept hearing about Docker container and Kubernetes. That definitely arose my FOMO. It seemed like that everyone knows about the technique. I had tried it once before but that was a catastrophe, and it's time to refight the battle.

Docker, from my understanding, is a software platform that packages solfware into a unit, which is called container. A container provides the all it needs to run the solfware. In this case, we can run the container on any environment. That could make deploying and scaling applications more quickly and easier.

It really makes me set up all environment to run my node server and DB so simply. All it need is to write few lines code in Dockerfile and docker-compose and you can set up the environment. Besides, you are able to access different files depending on different environment, like developement, staging or production.

**Dockerfile**

```Dockerfile
FROM node:14

WORKDIR /app

ENV PORT 80

COPY package.json /app/package.json

RUN npm install

COPY . /app

# replace ormconfig.json with ormconfig.docker.json
COPY ormconfig.docker.json /app/ormconfig.json

CMD ["npm", "run", "start--prod"]
```

---
