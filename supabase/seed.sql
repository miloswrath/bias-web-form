INSERT INTO responses
  (graduation_semester, field_of_study, internship_experience, job_status, role_types, biggest_concern)
VALUES
  ('Spring 2026', 'Business Analytics',  'multiple', 'yes',       ARRAY['full_time'],                         'Finding work-life balance'),
  ('Fall 2026',   'Computer Science',    'one',      'exploring',  ARRAY['full_time', 'grad_school'],          NULL),
  ('Spring 2026', 'Marketing',           'none',     'no',         ARRAY['unsure'],                            'Student loan debt'),
  ('Spring 2027', 'Finance',             'one',      'yes',        ARRAY['full_time', 'freelance'],            'Relocating to a new city'),
  ('Fall 2025',   'Information Systems', 'multiple', 'yes',        ARRAY['full_time'],                         NULL),
  ('Spring 2026', 'Psychology',          'none',     'exploring',  ARRAY['grad_school'],                       'Figuring out my career path'),
  ('Fall 2026',   'Economics',           'multiple', 'yes',        ARRAY['full_time', 'entrepreneurship'],     'Paying off student loans');
