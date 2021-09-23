---
title: 'Snapshot of Procrastination - Why and Web Structure '
description: "In this article, I'll share how I built this web application, procrastination, and the props and cons of the tech stack I chose"
publishedAt: '2021-09-30'
image: 'https://images.unsplash.com/photo-1631084948908-1b921a1a59cc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop'
project: true
---

## Web

As an UI engineer, I'm more familiar with the web developement. I'll separate it into four parts:

- web library and framework
- style
- state management
- other

to explain how I built the site and talk about the pros and cons.

#### Web Library and Framework

I chose **React with Next** in this project.

###### React

I've tried Vue and Svelte, and they both provide some declarative syntax and templates, which I personally feel a little bit annoying whereas some people claim it's more straightforward. React, except JSX, **it allows you to use a plain javascript syntax to write the entire code.** That is my favorite part of React.

###### Next

Next is a framework of React and provide you a developer-friendly experience to build modern websites.

In my previous job, we used Gatsby to build our landing page and web app. Gatsby is also a React's framework and it mainly provides SSG for you to build static websites, but it also has the SSR api for you to fetch data in the server side. Back in the day, Next hadn't allowed SSG so our team chose Gatsby for the performance in this case.

However, my experience of Gatsby wasn't really good. Those fucking confusing configuration really messed me up, but it could result from my terrible understanding of webpack at that time. In addition, when I chose my tech stack, Next had already provided couple pre-rendering methods, including SSG, SSR and ISR as well. Therefore, I chose Next as my React's framework this time.

As their landing page said, Next.js actually gave me the best developer experience especially for couple reasons:

- Compared to a plain react app, the entire app structure doesn't change a lot. If you are already a React developer, you can learn Next with a slight learing curve.
- It provides an easy way to set up typescript, CSS-in-JS library, storybook, testing library, webpack, babel and eslint.
- It provides apis to improve the optimization, such as [Image tag](https://nextjs.org/docs/api-reference/next/image) and [AMP support](https://nextjs.org/docs/advanced-features/amp-support/introduction) and some for [flexible data fetching](<(https://nextjs.org/docs/basic-features/data-fetching)>) in different situations.

- Oh, and [Fast Refresh](https://nextjs.org/docs/basic-features/fast-refresh) is the best part. While building the Next app, most edits will be visible within a second, without losing component state. This was so smooth that I didn't noticed it until I was building a Svelte app. It was pretty irritatting Svelte reset all my state when I changed somthing in my code.

Next really gave me a great experience and it might be my top first priority in the future when I want to build either a server-side rendering app or a hybrid static app.

##### Style Library

I chose **[Chakra UI](https://chakra-ui.com/)** in this project.

I like to use CSS-in-JS libraries, such as [Emotion](https://emotion.sh/docs/introduction) and [Styled-Components](https://styled-components.com/), which I've used in several projects. It allows me to build a component in one file only and I don't have to worry about the same-selector issue due to it creates scoped seletors.

Chakra UI is a component library for react and it creates components with emotion underneath the hood. It allows us to style components **with props of components**, and also helps us handle the responsive and color mode with simple apis.

In my opinion, Chakra UI provides a great balance between utilitis-first and components-first libraries. I'm able to use these built-in components to build most parts of my app; on the other hand, it's flexible enough for me to easily custumize my own style, unlike other components-first libraries such as [Bootstrap](https://getbootstrap.com/) or [Ant Design](https://ant.design/), which is hard to change styles into what you want.

##### State Management

I chose **Zustand** for client-side states and **React Query** for server-side caches.

I've used [Redux](https://redux.js.org/), [Constate](https://github.com/diegohaz/constate) and [context api](https://reactjs.org/docs/context.html) in previous projects. Basically, no matter what I used above, the concects are the same. There is always a global object to store the state for the entire app. To manipulate data, we fetch data in the page and pass down data to components through Flux architechture.

![One Global Object Schematic Diagram](https://i.imgur.com/kfOUc9Q.png)

But when using the combination of Zustand and React Query, it has a slightly different. In this case, we divide the global object into two parts: the client state and the server cache. Zustand only serves as a client-state management meanwhile React Query only serves as a server-state handler.

![Separated Global Object Schematic Diagram](https://i.imgur.com/zMUGfN9.png)

Why do I do this? I think the main reason is because we essentially use different ways to handle client state and server state. When handling server state, we have to **fetch, cache, synchronize and update** data, which are unnecessary when handling the client state. With React Query, I'm able to do all these feature in a simple function.

###### React Query

For me, React Query is a library that helps me handle the server state **with a declarative way**. It not only stores cache but also provides methods for you to do error handling, data initialization, data reset and other things you probably need to go through when manipulating server state.

```typescript
function fetchDeleteData(uuid: string, token: string) {
  return axios({
    method: 'DELETE',
    baseURL: API_BASE_URL,
    url: `/event/e/${uuid}`,
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
}

function useEventDeleteMutation(queryClient: QueryClient) {
  return useMutation(
    ({ id, token }: { id: string; token: string }) =>
      fetchDeleteData(id, token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QUERY_KEYS.currentUser);
      },
      onError: (err) => {
        console.error(err);
      },
      onSettled: () => {
        queryClient.invalidateQueries(QUERY_KEYS.currentUser);
      },
    }
  );
}
```

This is a simple example in my app to show how React Query works. `useMutation` is an api that handles mutation actions, including **POST, PUT, PATCH, DELETE**. In this case, it handles a delete action and we can inspect few things:

- The first parameter is a fetching function.
- The second parameter is an object that provides you methods to deal with different situations.

It's so declarative and you don't need to do any try catch function to make codes become long and nested. This is my favorite part of this library. I think there are lots of usecases I haven't figure out and it's really fun to dig in this library to get them out.

###### Zustand

Zustand is created by the author of react-spring and react-three-fiber, Poimandres (shout out to [Poimandres](https://pmnd.rs/)). It's a small redux with less syntax and a smaller package for me. It has the same concept of state and dispatcher, and also some simular tools, such as devtools and middlewares. **The main difference is that Zustand isn't tied to react context** (I haven't understood how it works underneath the hood) so that it's able to use in any framework or even a plain javascript project. I really enjoy playing around with this library due to:

- **Simplified Redux** -
  I hate redux because of complex syntax and file system. When creating a reducer, I needed to deal with at least three files and that pissed me off. Zustand fix this problem but doesn't break the concept so that it's easy to migrant from redux.

- **Not React Only** -
  Due to Zustand isn't tied to react context, I can use it in different frameworks. This is the special part which no other library is equipped with.

- **The Cutest Bear Ever!!!!!!!!!!!!!!** -
  Frankly, I was attracted by the cutest bear at first, otherwise I might be still using constate or react context in this project.

But the drawback is the inconprehensive document. Some information might be insufficent in the doc and I have to fint it out in issues or source code.

##### Others

###### Typescript

While [Deno and Svelte are moving away Typescript from their internals due to build times and code complexity](https://twitter.com/swyx/status/1350427690814251010/photo/1), Typescript is still my favorite.

Typescript really helps me with my speed and accuracy. Thanks for the greate integration typescript and vscode, I don't need to console variables out to know what the data structure is. All I need to do is to hover on the variable and the data type shows.
