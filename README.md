# `vps-issue-fs-param-route-prec`

1. `npm install`.
2. `npm run dev`.
3. Go to `/random`.
4. You will see `PARAMETERIZED FILESYSTEM ROUTE random`;
5. Go to `/test`.
6. You will see `PARAMETERIZED FILESYSTEM ROUTE test`;
7. I would expect to see `REGULAR FILESYSTEM ROUTE`.

This is because there is a file `test.page.vue`, which is more specific than `@test.page.vue` and therefore should take precedence.
