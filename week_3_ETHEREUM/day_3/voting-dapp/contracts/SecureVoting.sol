// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SecureVoting {
    struct Proposal {
        uint id;
        string title;
        string description;
        string[] options;
        mapping(string => uint) votes;
        uint endTime;
    }

    mapping(uint => Proposal) public proposals;
    mapping(address => mapping(uint => bool)) public voters;
    uint public proposalCount;
    address public owner;

    event ProposalCreated(uint id, string title, uint endTime);
    event Voted(uint proposalId, string option, address voter);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createProposal(
        string memory _title,
        string memory _description,
        string[] memory _options,
        uint _durationMinutes
    ) public onlyOwner {
        Proposal storage p = proposals[proposalCount];
        p.id = proposalCount;
        p.title = _title;
        p.description = _description;
        p.options = _options;
        p.endTime = block.timestamp + (_durationMinutes * 1 minutes);
        
        proposalCount++;
        emit ProposalCreated(p.id, _title, p.endTime);
    }

    function vote(uint _proposalId, string memory _option) public {
        Proposal storage p = proposals[_proposalId];
        require(block.timestamp <= p.endTime, "Voting period ended");
        require(!voters[msg.sender][_proposalId], "Already voted");
        require(isValidOption(_proposalId, _option), "Invalid option");

        voters[msg.sender][_proposalId] = true;
        p.votes[_option]++;
        emit Voted(_proposalId, _option, msg.sender);
    }

    function isValidOption(uint _proposalId, string memory _option) private view returns (bool) {
        string[] memory options = proposals[_proposalId].options;
        for(uint i = 0; i < options.length; i++) {
            if(keccak256(bytes(options[i])) == keccak256(bytes(_option))) {
                return true;
            }
        }
        return false;
    }

    function getResults(uint _proposalId) public view returns (string[] memory, uint[] memory) {
        Proposal storage p = proposals[_proposalId];
        uint[] memory voteCounts = new uint[](p.options.length);
        
        for(uint i = 0; i < p.options.length; i++) {
            voteCounts[i] = p.votes[p.options[i]];
        }
        return (p.options, voteCounts);
    }
}
