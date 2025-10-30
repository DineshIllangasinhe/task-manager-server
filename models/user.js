const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcrypt');

class User extends Model {
  static initModel(sequelize) {
    User.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: { isEmail: true }
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      timestamps: true
    });
    return User;
  }

  async checkPassword(plain) {
    return bcrypt.compare(plain, this.passwordHash);
  }

  toJSON() {
    const values = Object.assign({}, this.get());
    delete values.passwordHash;
    return values;
  }
}

module.exports = User;
