// createAdmin.js - runs only on fresh database initialization
(function() {
  const dbName = process.env.MONGO_INITDB_DATABASE || process.env.MONGO_DATABASE || 'pesquisa_satisfacao';
  const user = process.env.MONGO_INITDB_ROOT_USERNAME || process.env.MONGO_ROOT_USERNAME || 'root';
  const pwd = process.env.MONGO_INITDB_ROOT_PASSWORD || process.env.MONGO_ROOT_PASSWORD || 'secure_password';

  const adminDB = db.getSiblingDB('admin');
  try {
    const exists = adminDB.system.users.find({user: user}).count();
    if (!exists) {
      print('Creating mongo root user:', user);
      adminDB.createUser({
        user: user,
        pwd: pwd,
        roles: [{ role: 'root', db: 'admin' }]
      });
    } else {
      print('Mongo root user already exists:', user);
    }
  } catch (e) {
    print('Error creating mongo user:', e);
  }
})();
