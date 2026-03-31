# Feature Spec -> Create Web Survey
---

## Requirements
---
- Make a web survey using typescript and tailwind
- Link that to the Supabase pgdb initialized in this repo
    - local development server start at:
         API URL: http://127.0.0.1:54321
     GraphQL URL: http://127.0.0.1:54321/graphql/v1
  S3 Storage URL: http://127.0.0.1:54321/storage/v1/s3
          DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
      Studio URL: http://127.0.0.1:54323
    Inbucket URL: http://127.0.0.1:54324
- Create migrations and run on local server as test
- Connect to the following (exempting required keys, assume hosting on Azure, write steps for finalizing hosting and connecting in [quickstart.md])
- Ensure the site saves responses in that db
- Create visualizations for insights (whatever you deem most relevant and interesting)

## Context on the form
---
***FORM THEME***: Post-Undergraduate Plans
***Form Requirements***:
```plaintext
You should use at least a text input box, radio buttons, dropdown list, and checkboxes.

Your survey should be 4 - 8 questions. Write our your questions and the options for radio buttons, dropdown lists, and checkboxes. Organize your questions from easier to harder to answer.

There should be a results page that gives general feedback about your survey.
```
***Example Questions***:
- When do you plan on gradudating?
- Do you have jobs or plans lined up for after graduation?
- Have you done any internships?
*Populate the rest!*
*Insights should be relevant to these questions, visual, and interesting!*
