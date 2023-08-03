import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Modifyinfo = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const [age, setAge] = useState(null);
//   const [nickname, setNickname] = useState(null);
//   const [password, setPassword] = useState(null);
//   const [profileImg, setProfileImg] = useState(null);
//   const [profileMusic, setProfileMusic] = useState(null);
//   const [sex, setSex] = useState(null);
//   const [synk, setSynk] = useState(null);

  const handleInputChange = (setFunction) => (event) => {
    const value = event.target.value;
    setFunction(value ? value : null);
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    const updateData = {
      age: age,
    //   nickname: nickname,
    //   password: password,
    //   profileImg: profileImg,
    //   profileMusic: profileMusic,
    //   sex: sex,
    //   synk: synk
    };

    try {
      const response = await axios({
        method: 'patch',
        url: 'https://localhost:8443/api/v1/users/modify',
        data: updateData,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log(response.data);
      
      toast.success("수정이 완료되었습니다!", {
        onClose: () => navigate('/')
      });
      
    } catch (error) {
      console.error(error);
      toast.error("수정에 실패하였습니다.");
    }
  };

  useEffect(() => {
    // Remove the call to handleUpdate in useEffect
    // You want to call it only when user click the update button
  }, []);

  return (
    <div>
    <ToastContainer />
        <form onSubmit={handleUpdate}>
        <label>
            Age:
            <input type="text" value={age || ''} onChange={handleInputChange(setAge)} />
        </label>
        {/* <br/>
        <label>
            Nickname:
            <input type="text" value={nickname || ''} onChange={handleInputChange(setNickname)} />
        </label>
        <br/>
        <label>
            Password:
            <input type="password" value={password || ''} onChange={handleInputChange(setPassword)} />
        </label>
        <br/>
        <label>
            Profile Image:
            <input type="text" value={profileImg || ''} onChange={handleInputChange(setProfileImg)} />
        </label>
        <br/>
        <label>
            Profile Music:
            <input type="text" value={profileMusic || ''} onChange={handleInputChange(setProfileMusic)} />
        </label>
        <br/>
        <label>
            Sex:
            <input type="text" value={sex || ''} onChange={handleInputChange(setSex)} />
        </label>
        <br/>
        <label>
            Synk:
            <input type="text" value={synk || ''} onChange={handleInputChange(setSynk)} />
        </label>
        <br/> */}
        <button type="submit">Update</button>
        </form>
    </div>
  );
};

export default Modifyinfo;
