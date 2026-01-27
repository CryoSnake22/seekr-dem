-- Seed Data for Skills Market Data
-- Run this AFTER schema.sql

-- Software Engineer / Full Stack Developer Skills
INSERT INTO public.skills_market_data (job_role, skill_name, frequency_count, frequency_percentage, priority_level) VALUES
  ('Software Engineer', 'React', 85, 85.00, 'High'),
  ('Software Engineer', 'TypeScript', 78, 78.00, 'High'),
  ('Software Engineer', 'JavaScript', 92, 92.00, 'High'),
  ('Software Engineer', 'Node.js', 72, 72.00, 'High'),
  ('Software Engineer', 'Docker', 68, 68.00, 'Medium'),
  ('Software Engineer', 'AWS', 55, 55.00, 'Medium'),
  ('Software Engineer', 'PostgreSQL', 52, 52.00, 'Medium'),
  ('Software Engineer', 'Git', 88, 88.00, 'High'),
  ('Software Engineer', 'REST API', 76, 76.00, 'High'),
  ('Software Engineer', 'CI/CD', 42, 42.00, 'Medium'),
  ('Software Engineer', 'GraphQL', 23, 23.00, 'Low'),
  ('Software Engineer', 'MongoDB', 38, 38.00, 'Medium'),
  ('Software Engineer', 'Redis', 28, 28.00, 'Low'),
  ('Software Engineer', 'Kubernetes', 32, 32.00, 'Low'),
  ('Software Engineer', 'Next.js', 45, 45.00, 'Medium'),
  ('Software Engineer', 'Tailwind CSS', 38, 38.00, 'Medium'),
  ('Software Engineer', 'Python', 48, 48.00, 'Medium'),
  ('Software Engineer', 'Express.js', 58, 58.00, 'Medium'),
  ('Software Engineer', 'Microservices', 35, 35.00, 'Low'),
  ('Software Engineer', 'Agile', 64, 64.00, 'Medium');

-- Data Analyst Skills
INSERT INTO public.skills_market_data (job_role, skill_name, frequency_count, frequency_percentage, priority_level) VALUES
  ('Data Analyst', 'SQL', 95, 95.00, 'High'),
  ('Data Analyst', 'Python', 82, 82.00, 'High'),
  ('Data Analyst', 'Excel', 88, 88.00, 'High'),
  ('Data Analyst', 'Tableau', 65, 65.00, 'Medium'),
  ('Data Analyst', 'Power BI', 58, 58.00, 'Medium'),
  ('Data Analyst', 'Pandas', 52, 52.00, 'Medium'),
  ('Data Analyst', 'NumPy', 45, 45.00, 'Medium'),
  ('Data Analyst', 'Data Visualization', 72, 72.00, 'High'),
  ('Data Analyst', 'Statistics', 68, 68.00, 'Medium'),
  ('Data Analyst', 'R', 38, 38.00, 'Low'),
  ('Data Analyst', 'Jupyter', 42, 42.00, 'Medium'),
  ('Data Analyst', 'Machine Learning', 35, 35.00, 'Low'),
  ('Data Analyst', 'ETL', 48, 48.00, 'Medium'),
  ('Data Analyst', 'Data Warehousing', 42, 42.00, 'Medium'),
  ('Data Analyst', 'BigQuery', 28, 28.00, 'Low');

-- Frontend Developer Skills
INSERT INTO public.skills_market_data (job_role, skill_name, frequency_count, frequency_percentage, priority_level) VALUES
  ('Frontend Developer', 'React', 92, 92.00, 'High'),
  ('Frontend Developer', 'JavaScript', 98, 98.00, 'High'),
  ('Frontend Developer', 'TypeScript', 75, 75.00, 'High'),
  ('Frontend Developer', 'CSS', 95, 95.00, 'High'),
  ('Frontend Developer', 'HTML', 98, 98.00, 'High'),
  ('Frontend Developer', 'Tailwind CSS', 62, 62.00, 'Medium'),
  ('Frontend Developer', 'Next.js', 58, 58.00, 'Medium'),
  ('Frontend Developer', 'Redux', 48, 48.00, 'Medium'),
  ('Frontend Developer', 'Webpack', 35, 35.00, 'Low'),
  ('Frontend Developer', 'Vue.js', 28, 28.00, 'Low'),
  ('Frontend Developer', 'Responsive Design', 85, 85.00, 'High'),
  ('Frontend Developer', 'REST API', 72, 72.00, 'High'),
  ('Frontend Developer', 'Git', 88, 88.00, 'High'),
  ('Frontend Developer', 'Figma', 55, 55.00, 'Medium'),
  ('Frontend Developer', 'Testing (Jest)', 45, 45.00, 'Medium');

-- DevOps Engineer Skills
INSERT INTO public.skills_market_data (job_role, skill_name, frequency_count, frequency_percentage, priority_level) VALUES
  ('DevOps Engineer', 'Docker', 88, 88.00, 'High'),
  ('DevOps Engineer', 'Kubernetes', 78, 78.00, 'High'),
  ('DevOps Engineer', 'AWS', 85, 85.00, 'High'),
  ('DevOps Engineer', 'CI/CD', 92, 92.00, 'High'),
  ('DevOps Engineer', 'Terraform', 62, 62.00, 'Medium'),
  ('DevOps Engineer', 'Jenkins', 58, 58.00, 'Medium'),
  ('DevOps Engineer', 'Linux', 82, 82.00, 'High'),
  ('DevOps Engineer', 'Git', 88, 88.00, 'High'),
  ('DevOps Engineer', 'Python', 55, 55.00, 'Medium'),
  ('DevOps Engineer', 'Bash', 68, 68.00, 'Medium'),
  ('DevOps Engineer', 'Ansible', 45, 45.00, 'Medium'),
  ('DevOps Engineer', 'Monitoring', 65, 65.00, 'Medium'),
  ('DevOps Engineer', 'Azure', 48, 48.00, 'Medium'),
  ('DevOps Engineer', 'GCP', 38, 38.00, 'Low'),
  ('DevOps Engineer', 'Grafana', 35, 35.00, 'Low');

-- Backend Developer Skills
INSERT INTO public.skills_market_data (job_role, skill_name, frequency_count, frequency_percentage, priority_level) VALUES
  ('Backend Developer', 'Node.js', 75, 75.00, 'High'),
  ('Backend Developer', 'Python', 68, 68.00, 'Medium'),
  ('Backend Developer', 'Java', 52, 52.00, 'Medium'),
  ('Backend Developer', 'PostgreSQL', 72, 72.00, 'High'),
  ('Backend Developer', 'MongoDB', 58, 58.00, 'Medium'),
  ('Backend Developer', 'REST API', 88, 88.00, 'High'),
  ('Backend Developer', 'GraphQL', 38, 38.00, 'Low'),
  ('Backend Developer', 'Docker', 65, 65.00, 'Medium'),
  ('Backend Developer', 'Redis', 48, 48.00, 'Medium'),
  ('Backend Developer', 'Microservices', 55, 55.00, 'Medium'),
  ('Backend Developer', 'AWS', 62, 62.00, 'Medium'),
  ('Backend Developer', 'Express.js', 68, 68.00, 'Medium'),
  ('Backend Developer', 'TypeScript', 58, 58.00, 'Medium'),
  ('Backend Developer', 'SQL', 82, 82.00, 'High'),
  ('Backend Developer', 'Git', 85, 85.00, 'High');
