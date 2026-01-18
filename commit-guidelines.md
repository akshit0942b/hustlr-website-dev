# 📝 Commit Message Guidelines

We use the **Conventional Commits** convention to keep a clean and meaningful Git history. This helps with automation (changelogs, semantic versioning) and makes it easier to understand what changed and why.

---

## 📦 Format

Each commit message **must** follow this structure:

```
<type>(optional-scope): <short summary>

[optional body]

[optional footer]
```

---

## 🧱 Examples

```
feat(auth): add support for JWT login
fix(nav): fix mobile dropdown menu
docs(readme): update install instructions
style: format code with Prettier
refactor(api): simplify error handling
test: add unit tests for validation logic
chore: update dependencies
```

---

## 🧠 Types

| Type       | Description                                           |
| ---------- | ----------------------------------------------------- |
| `feat`     | A new feature                                         |
| `fix`      | A bug fix                                             |
| `docs`     | Documentation changes only                            |
| `style`    | Formatting, missing semicolons, whitespace etc.       |
| `refactor` | Code that changes structure without changing behavior |
| `test`     | Adding or updating tests                              |
| `chore`    | Changes to build process, CI, tools, dependencies     |

---

## 📘 Scope (optional)

Use a scope to clarify what part of the codebase is affected. Examples:

- `auth`
- `navbar`
- `api`
- `readme`

---

## 🔒 Rules

- Use the **imperative mood** in the summary (`fix` not `fixed`, `add` not `added`)
- Keep the summary under **72 characters**
- Wrap body at 100 characters per line
- Use body if you need to explain _why_ a change was made

---

## ✅ Good Commit

```
feat(dashboard): add monthly revenue graph

The chart.js library was used to render the graph. This will help users visualize revenue trends.
```

---

## 🚫 Bad Commit

```
updated stuff
```
