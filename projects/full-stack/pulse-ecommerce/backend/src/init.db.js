await pool.query(`
  UPDATE users
  SET role='admin'
  WHERE email = 'admin@pulse.com';
`);
