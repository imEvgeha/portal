# Rules

-   **Less is more!**
-   Follow [SOLID](https://en.wikipedia.org/wiki/SOLID), [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself), [KISS](https://en.wikipedia.org/wiki/KISS_principle) and [YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)
-   Write small components that do one thing and do it well

# Commit rules

-   Each commit message header should follow this regex `^PORT-\d+: \S.*` i.e. start with the JIRA ticket
-   The commit message header should be short and descriptive
-   Further details can be added in the commit message body

# Pull Request Process

-   Ensure that the tests pass **before** creating the PR
-   Each PR needs at least two approvals before it can be merged to master

# Styling components

- For styling we use sass and custom theming which is based on Atlaskit design sistem.
- Please refer to the following 3 files for better understanding how do we style components:
    `src/styles/atlaskit/theme.scss`\
    `src/styles/atlaskit/mixins.scss`\
    `src/styles/atlaskit/colors/scss`
    
- Mixins use relative units instead of absolute
- The most common mixins used in code are

    `heading`\
    `margin`\
    `padding`\
    `addSpacing`
    
 - Some examples:
 
    `@include heading(h200)`\
    `@include margin(0, 2, 2, 0)`\
    `@include padding(10, 20, 20, 10)`\
    `@include addSpacing('height', 150)`
