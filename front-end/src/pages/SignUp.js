import React from 'react';
import axios from 'axios';




class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: '',
      password: '',
      age: '',
      sex: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/v1/users', {
        userId: this.state.userId,
        password: this.state.password,
        age: this.state.age,
        sex: this.state.sex
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          UserID:
          <input type="text" name="userId" onChange={this.handleChange} />
        </label>
        <label>
          Password:
          <input type="password" name="password" onChange={this.handleChange} />
        </label>
        <label>
          Age:
          <input type="text" name="age" onChange={this.handleChange} />
        </label>
        <label>
          Gender:
          <input type="text" name="sex" onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default SignUp;
