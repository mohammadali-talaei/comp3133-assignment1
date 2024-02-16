const User = require('../models/User');
const Employee = require('../models/Employee');
const bcrypt = require('bcryptjs');
const emailValidator = require('email-validator'); 


const validateStringLength = (str, min, max) => str.length >= min && str.length <= max;
const validateSalary = (salary) => salary > 0;


const resolvers = {

  Query: {
    async login(_, { username, password }) {
      const user = await User.findOne({ username });
      if (!user || !bcrypt.compareSync(password, user.password)) {
        throw new Error('Invalid credentials');
      }
      return user;
    },
    async getEmployees() {
      return await Employee.find();
    },
    async getEmployee(_, { id }) {
      return await Employee.findById(id);
    },
  },
  Mutation: {
    async signup(_, { username, email, password }) {
      // Validate input data
      if (!validateStringLength(username, 3, 30)) {
        throw new Error('Username must be between 3 and 30 characters');
      }
      if (!emailValidator.validate(email)) {
        throw new Error('Invalid email format');
      }
      if (!validateStringLength(password, 8, 50)) {
        throw new Error('Password must be between 8 and 50 characters');
      }
      // Existing user validation
      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
        throw new Error('User already exists');
      }
      const hashedPassword = bcrypt.hashSync(password, 12);
      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();
      return newUser;
    },
    async addEmployee(_, { first_name, last_name, email, gender, salary }) {
// Validate input data
if (!validateStringLength(first_name, 2, 50) || !validateStringLength(last_name, 2, 50)) {
  throw new Error('First name and last name must be between 2 and 50 characters');
}
if (!emailValidator.validate(email)) {
  throw new Error('Invalid email format');
}
if (!['Male', 'Female', 'Other'].includes(gender)) {
  throw new Error('Gender must be Male, Female, or Other');
}
if (!validateSalary(salary)) {
  throw new Error('Salary must be positive');
}

      const newEmployee = new Employee({ first_name, last_name, email, gender, salary });
      await newEmployee.save();
      return newEmployee;
    },
    async updateEmployee(_, { id, first_name, last_name, email, gender, salary }) {
      const employee = await Employee.findById(id);
      if (!employee) {
        throw new Error('Employee not found');
      }

      // For updates, validate only if the fields are provided
      if (email && !emailValidator.validate(email)) {
        throw new Error('Invalid email format');
      }
      if (first_name && !validateStringLength(first_name, 2, 50) || last_name && !validateStringLength(last_name, 2, 50)) {
        throw new Error('First name and last name must be between 2 and 50 characters');
      }
      if (salary && !validateSalary(salary)) {
        throw new Error('Salary must be positive');
      }
      
      employee.first_name = first_name || employee.first_name;
      employee.last_name = last_name || employee.last_name;
      employee.email = email || employee.email;
      employee.gender = gender || employee.gender;
      employee.salary = salary || employee.salary;
      await employee.save();
      return employee;
    },
    async deleteEmployee(_, { id }) {
      const employee = await Employee.findById(id);
      if (!employee) {
        throw new Error('Employee not found');
      }
      await employee.deleteOne();
      return {
        id: employee.id, 
        message: `Employee with ID ${employee.id} is successfully deleted.`
      };
    },
  },
};

module.exports = resolvers;
