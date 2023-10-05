//SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 < 0.9.0;

contract DepaToken{
    //token datas.
    string public name = "DepaToken";
    string public symbol = "DEP";
    string public standard = "DepTkn v.0.1";
    uint256 public totalSupply;
    uint256 public _userId;

    address  public ownerOfContract;
    address[] public tokenHolder2;

    //Token events. 
    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

    //mapping (token holders properties).

    mapping(address => TokenHolderInfo) public tokenHolderInfos;

    mapping(address => mapping(address => uint256)) public allowance;

    mapping(address => uint256) public tokenBalance;
    //the mapping struct.
    struct TokenHolderInfo{
        uint256 _tokenId;
        address _from;
        address _to;
        uint256 _totalToken;
        bool _tokenHolder;
    }

   

    //constructor (initializing number of tokens).
    constructor(uint256 _initialSupply) {
        ownerOfContract = msg.sender;
        tokenBalance[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }

    //keeps track of ids by increasing number of ids everty time a function is called.
    function inc() internal{
        _userId++;
    }

    //allows owner of token to transfer token to addresses.
    function transfer(address _to, uint256 _value)public returns(bool success){
        require(tokenBalance[msg.sender] >= _value);
        inc();

        tokenBalance[msg.sender] -= _value;
        tokenBalance[_to] += _value;

        TokenHolderInfo storage tokenHolderInfo = tokenHolderInfos[_to];

        tokenHolderInfo._to = _to;
        tokenHolderInfo._from = msg.sender;
        tokenHolderInfo._totalToken = _value;
        tokenHolderInfo._tokenHolder = true;
        tokenHolderInfo._tokenId = _userId;

        tokenHolder2.push(_to);

        emit Transfer(msg.sender, _to, _value);

        return true;
    }

    //Approving someone else to spent token on our behalf.
    function approve(address _spender, uint256 _value)public returns (bool success){
        allowance[msg.sender][_spender] = _value;

        emit Approval(msg.sender, _spender, _value);

        return true;
    }

    //for only those allowed to transfer token on behalf of us.abi
    function transferFrom(address _from, address _to, uint256 _value)public returns(bool success) {
        tokenBalance[_from] -= _value;
        tokenBalance[_to] += _value;

        allowance[_from][msg.sender] -= _value;

        emit Transfer(_from, _to, _value);
        
        return true;
    }

    //Hold data from snart contract and display it in front end applicatio

    function getTokenHolderData(address _address) public view returns(uint256, address, address, uint256, bool){
        return(
            tokenHolderInfos[_address]._tokenId,
            tokenHolderInfos[_address]._to,
            tokenHolderInfos[_address]._from,
            tokenHolderInfos[_address]._totalToken,
            tokenHolderInfos[_address]._tokenHolder

        );
    }
    
    function getTokenHolder() public view returns(address[] memory){
        return tokenHolder2;
    }
}