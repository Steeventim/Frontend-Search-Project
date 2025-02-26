# Code Citations

## License: inconnu

https://github.com/JoaoJuniorProg/dataForm/tree/d5fcbae412a74c03af7aac048ec8b9c36fc0f9df/src/modules/pages/login/login.tsx

```
React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState
```

## License: inconnu

https://github.com/BenedictUmeozor/ThoughtForum-frontend-/tree/9b2c4a1416ecddfe950f0ed0e45a4ce18d1781e7/src/pages/Signin.tsx

```
() => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null
```

## License: inconnu

https://github.com/NahuelBenitez/RollingFoof-Front/tree/1bc4edd120ea20963f35554479efb9ccb223ff95/src/pages/Login.jsx

```
</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={
```

## License: inconnu

https://github.com/madhusudan-kulkarni/meetup-app/tree/d8f23dbe218485a033444420074cf39c38b6891f/src/components/RSVPModal.jsx

```
>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.
```

# Code Citations

## License: inconnu

https://github.com/terry-goldenowl/personal-finance-manager-fe/tree/6dc46e0eb529b6eee293f3fa4adb7df5aad24788/src/config/axiosConfig.js

```
.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) =>
```
