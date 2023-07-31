// SignUp.js
import React from 'react';

function SignUp() {
  return (
    <div>
      <h1>Sign Up</h1>
      <form>
        <input type="text" placeholder="userId" />
        <input type="password" placeholder="password" />
        <select name="sex" id="sex">
            <option value="">성별을 선택하세요</option>
            <option value="0">남</option>
            <option value="1">여</option>
        </select>
        <input type="number" placeholder="age" /> {/* 나이 입력 필드 추가 */} 
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignUp;
