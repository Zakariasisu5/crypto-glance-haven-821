import { useState, useEffect } from 'react';
import { useContract } from '../hooks/useContract'; // Adjust path

const DePINFundingComponent = ({ userAddress }) => { // Pass userAddress from parent (e.g., connected account)
const { contribute, claimYield, getContributor, getPoolStats, watchEvents } = useContract();
const [amount, setAmount] = useState(0.01); // Default contribution in ETH
const [userData, setUserData] = useState(null);
const [poolStats, setPoolStats] = useState(null);

const handleContribute = async () => {
try {
    const tx = await contribute(amount);
    console.log('Transaction:', tx.hash);
    alert('Contribution successful!');
    fetchData(); // Refresh data
} catch (error) {
    console.error('Contribute failed:', error);
    alert('Error: ' + error.message);
}
};

const handleClaimYield = async () => {
try {
    const tx = await claimYield();
    console.log('Transaction:', tx.hash);
    alert('Yield claimed!');
    fetchData();
} catch (error) {
    console.error('Claim failed:', error);
    alert('Error: ' + error.message);
}
};

const fetchData = async () => {
if (userAddress) {
    const contribData = await getContributor(userAddress);
    setUserData(contribData);
    const stats = await getPoolStats();
    setPoolStats(stats);
}
};

useEffect(() => {
fetchData();
// Watch for events (e.g., new contributions)
const unsubscribe = watchEvents('Contributed', (contributor, amount) => {
    console.log(`New contribution: ${contributor} contributed ${amount.toString()} wei`);
    fetchData(); // Refresh on event
});
return unsubscribe;
}, [userAddress]);

return (
<div>
    <h2>DePIN Funding</h2>
    <input
    type="number"
    value={amount}
    onChange={(e) => setAmount(parseFloat(e.target.value))}
    placeholder="ETH to contribute"
    />
    <button onClick={handleContribute}>Contribute</button>
    <button onClick={handleClaimYield}>Claim Yield</button>
    {userData && (
    <div>
        <p>Your Shares: {userData.shares} wei</p>
        <p>Pending Yield: {userData.pendingYield} wei</p>
        <p>Your NFT Token ID: {userData.tokenId}</p>
    </div>
    )}
    {poolStats && (
    <div>
        <p>Total Shares: {poolStats.totalShares} wei</p>
        <p>Total Contributions: {poolStats.totalContributions} wei</p>
        <p>Total Yields Distributed: {poolStats.totalYieldsDistributed} wei</p>
        <p>Available Balance: {poolStats.availableBalance} wei</p>
    </div>
    )}
</div>
);
};

export default DePINFundingComponent;