CREATE TABLE responses (
  id                     uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  graduation_semester    text        NOT NULL
                           CHECK (graduation_semester IN (
                             'Fall 2025', 'Spring 2026', 'Fall 2026', 'Spring 2027', 'Other'
                           )),
  field_of_study         text        NOT NULL CHECK (char_length(field_of_study) >= 1),
  internship_experience  text        NOT NULL
                           CHECK (internship_experience IN ('none', 'one', 'multiple')),
  job_status             text        NOT NULL
                           CHECK (job_status IN ('yes', 'no', 'exploring')),
  role_types             text[]      NOT NULL DEFAULT '{}',
  biggest_concern        text,
  created_at             timestamptz NOT NULL DEFAULT now()
);
