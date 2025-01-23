# Webshop frontend

React SPA that serves the webshop for the fictional service "plantasia". At plantasia users can buy and sell flowers. Don't you just want to get rid of that old flower in the corner of your livingroom?

Or maby you want to bring some fresh CO2 eating friends into your home :)

---

## Libraries used

### Architectually central libraries

```bash
-   redux               # state management
-   redux-saga          # business logic implemented through generator functions
```

### Utility libraries

```bash
-   immer               # better handling of nesting of redux state updates
-   date-fns            # de-facto datetime library, moment.js is old @Note(Victor): Opinionated subjective view
-   react-router-dom    # routing...
```

### UI

```bash
-   tailwind            # utility css classes as Lego™ bricks used to build the UI
```

### Notes
This was done with an older version of React, now there exists Redux Toolkit which is a more opinionated way of using Redux. I would recommend using that instead of the vanilla Redux setup that is used in this project. That way you wont have to write as much boilerplate code, like Action creators etc...
