### MoonFi – Decentralized Credit & Lending

MoonFi is a Creditcoin-inspired DeFi platform that combines blockchain credit profiles with lending pools, enabling users to borrow and lend based on their on-chain reputation.

The project bridges real-world crypto market data with mock + blockchain-based Creditcoin data, creating a powerful platform for transparent financial inclusion.


---

✨ Features

🔹 Smart Contracts

CreditProfile.sol

Track wallet-based credit scores.

Store loan history (amount, interest, repayment status).

Update scores and record repayments.


LendingPool.sol

Deposit ETH into the pool.

Borrow from the pool (later tied to credit score).

Repay borrowed funds.

Withdraw deposits anytime.



🔹 Backend (Node.js + Supabase)

Fetch live crypto market data from CoinGecko.

Provide mock Creditcoin DeFi data (price, users, lending rates).

Auth system (signup/signin) with Supabase.

Clean API responses in { success, data } format.


🔹 Frontend (Next.js Dashboard)

Landing page with testimonials & trusted companies section.

Auth (sign in / sign up before dashboard).

Dashboard with graphs & trends.

Wallet connection for blockchain integration.



---

📂 Project Structure

moonfi/
│── contracts/          # Solidity smart contracts
│   ├── CreditProfile.sol
│   └── LendingPool.sol
│── backend/            # Node.js + Express API
│   ├── routes/
│   ├── services/
│   └── server.js
│── frontend/           # Next.js frontend
│   ├── pages/
│   ├── components/
│   └── styles/
│── scripts/
│   └── deploy.js       # Hardhat deployment script
│── hardhat.config.js   # Hardhat config


---

🚀 Quick Start

1. Clone Repo

git clone https://github.com/<your-username>/moonfi.git
cd moonfi

2. Install Dependencies

npm install

3. Compile Smart Contracts

npx hardhat compile

4. Deploy Contracts

npx hardhat run scripts/deploy.js --network localhost

5. Start Backend Server

cd backend
npm start

6. Run Frontend

cd frontend
npm run dev


---

🛠️ Tech Stack

Frontend: Next.js, TailwindCSS, Wallet integration

Backend: Node.js, Express, Supabase, CoinGecko API

Blockchain: Solidity, Hardhat, Ethers.js

Database: Supabase (Postgres)



---

📌 Roadmap

✅ Phase 1: Smart contracts (CreditProfile + LendingPool).

✅ Phase 2: Backend API with mock Creditcoin + market data.

✅ Phase 3: Frontend dashboard + landing page.

🔜 Phase 4: Integrate smart contracts with frontend (wallet login).

🔜 Phase 5: Deploy to Polygon testnet + Creditcoin chain.



---

🤝 Contribution

We welcome contributions!

Fork the repo

Create a feature branch

Commit changes

Submit a Pull Request 🚀



---

📄 License

MIT License © 2025 MoonFi
