import { useEffect, useState } from "react";
import "./styles.css";
import { tenureData } from "./utils/constants";
import { numberWithCommas } from './utils/config';

export default function App() {
  const [cost, setCost] = useState(0);
  const [interest, setInterest] = useState(10);
  const [fee, setFee] = useState(1);
  const [downpayment, setDownpayment] = useState(0);
  const [emi, setEmi] = useState(0);
  const [tenure, setTenure] = useState(12);

  const calculateEmi=(downpayment)=>{
     // EMI amount = [P x R x (1+R)^N]/[(1+R)^N-1]
     if(!cost) return;

     const loanAmt = cost - downpayment;
     const rateOfInterest = interest/100;
     const numOfYears = tenure/12;

     const EMI =  (loanAmt * rateOfInterest * (1 + rateOfInterest) ** numOfYears) /
     ((1 + rateOfInterest) ** numOfYears - 1);

     return Number(EMI/12).toFixed(0);
  }

  const calculateDp =(emi)=>{
    if(!cost) return;

    const downpaymentPercent= 100 - (emi/calculateEmi(0))*100;
    return Number((downpaymentPercent/100) * cost).toFixed(0);
  } 

  useEffect(()=>{
    if(!(cost>0)) {
      setDownpayment(0);
      setEmi(0);
    }
    const emi = calculateEmi(downpayment)
    setEmi(emi)
  }, [tenure])

  const updateEmi=(e)=>{
    if(!cost) return;

    const dp = Number(e.target.value);
    setDownpayment(dp.toFixed(0));

    const emi = calculateEmi(dp)
    setEmi(emi)
  }

  const updateDownpayment=(e)=>{
    if(!cost) return;

    const emi = Number(e.target.value);
    setEmi(emi.toFixed(0));

    const dp=calculateDp(emi)
    setDownpayment(dp)
  }

  const totalDownPayment = () => {
    return numberWithCommas(
      (Number(downpayment) + (cost - downpayment) * (fee / 100)).toFixed(0)
    );
  };

  const totalEmi = ()=>{
    return numberWithCommas((emi * tenure).toFixed(0)) 
  }


  return (
    <div className="App">
      <span className="title" style={{fontSize:"30px"}}>EMI CALCULATOR</span>
      <span className="title">Total Cost of Assets</span>
      <input
        type="number"
        value={cost}
        onChange={(e) => setCost(e.target.value)}
        placeholder="Total Cost of Assets"
      />
      <span className="title">Interest Rate (in %) </span>
      <input
        type="number"
        value={interest}
        onChange={(e) => setInterest(e.target.value)}
        placeholder="Interest Rate (in %)"
      />
     
      <span className="title">Processing Fee (in %) </span>
      <input
        type="number"
        value={fee}
        onChange={(e) => setFee(e.target.value)}
        placeholder="Processing Fee (in %) "
      />
      <span className="title">Down Payment</span>
      <span className="title" style={{ textDecoration: "underline"}}>Total Down Payment - {""} {totalDownPayment()}</span>
      <div>
      <input
        type="range"
        className="slider"
        min={0}
        max={cost}
        value={downpayment}
        onChange={updateEmi}
        
      />

      <div className="labels">
        <label>0%</label>
        <b>{numberWithCommas(downpayment)}</b>
        <label>100%</label>
      </div>
      </div>

      <span className="title">Loan per Month</span>
      <span className="title" style={{ textDecoration: "underline"}}>Total Loan Amount - {""}{totalEmi()}</span>
      <div>
      <input
        type="range"
        className="slider"
        min={calculateEmi(cost)}
        max={calculateEmi(0)}
        value={emi}
        onChange={updateDownpayment}
        
      />
        <div className="labels">
        <label>{numberWithCommas(calculateEmi(cost))}</label>
        <b>{(numberWithCommas(emi))}</b>
        <label>{numberWithCommas(calculateEmi(0))}</label>
      </div>
      </div>
      <span className="title">Tenure</span>
      <div className="tenureContainer">
        {tenureData.map((t)=>{
            return <button className={`tenure ${t === tenure ? "selected" : ""}`} 
            onClick={(e)=>setTenure(t)}
            >
                {t}
            </button>
        })}
      </div>
    </div>

  );
}
