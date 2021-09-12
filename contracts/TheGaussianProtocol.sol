//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "./interfaces/IN.sol";

/**
 * @title TheGaussianProtocol
 */
contract TheGaussianProtocol is ERC721Enumerable, ReentrancyGuard, Ownable {
    using Strings for uint256;

    uint256 public constant MAX_TOKEN_ID = 8888;

    IN public immutable n;
    bool public publicSaleActive = false;
    string private _imageUriPrefix = "";

    mapping(uint256 => string) private tokenSeeds;

    constructor(address _nContractAddress) ERC721("The Gaussian Protocol", "GAUS") {
        n = IN(_nContractAddress);
    }

    function setBaseImageURI(string memory prefix) public onlyOwner {
        _imageUriPrefix = prefix;
    }

    function togglePublicSale() public onlyOwner {
        publicSaleActive = !publicSaleActive;
    }

    function random(string memory seed, uint8 offset) internal pure returns (uint8) {
        return uint8(uint256(keccak256(abi.encodePacked(seed, toString(offset)))));
    }

    function getRandomGaussianNumbers(string memory seed) public pure returns (uint256[8] memory) {
        uint256[8] memory numbers;
        for (uint8 i = 0; i < 8; ++i) {
            int64 accumulator = 0;
            for (uint8 j = 0; j < 16; ++j) {
                uint8 offset = (i * 16) + j;
                accumulator += int64(uint64(random(seed, offset)));
            }

            accumulator *= 10000;
            accumulator /= 16;
            accumulator = accumulator - 1270000;
            accumulator *= 10000;
            accumulator /= 733235;
            accumulator *= 8;
            accumulator += 105000;
            accumulator /= 10000;
            numbers[i] = uint256(uint64(accumulator));
        }

        return numbers;
    }

    function getNumbers(uint256 tokenId) public view returns (uint256[8] memory) {
        require(_exists(tokenId), "Nonexistent token");
        return getRandomGaussianNumbers(tokenSeeds[tokenId]);
    }

    function getFirst(uint256 tokenId) public view returns (uint256) {
        return getNumbers(tokenId)[0];
    }

    function getSecond(uint256 tokenId) public view returns (uint256) {
        return getNumbers(tokenId)[1];
    }

    function getThird(uint256 tokenId) public view returns (uint256) {
        return getNumbers(tokenId)[2];
    }

    function getFourth(uint256 tokenId) public view returns (uint256) {
        return getNumbers(tokenId)[3];
    }

    function getFifth(uint256 tokenId) public view returns (uint256) {
        return getNumbers(tokenId)[4];
    }

    function getSixth(uint256 tokenId) public view returns (uint256) {
        return getNumbers(tokenId)[5];
    }

    function getSeventh(uint256 tokenId) public view returns (uint256) {
        return getNumbers(tokenId)[6];
    }

    function getEight(uint256 tokenId) public view returns (uint256) {
        return getNumbers(tokenId)[7];
    }

    function _mintNumbers(uint256 tokenId) internal virtual {
        tokenSeeds[tokenId] = toString(tokenId);
        _safeMint(msg.sender, tokenId);
    }

    function mintWithN(uint256 tokenId) public virtual nonReentrant {
        require(n.ownerOf(tokenId) == msg.sender, "Invalid owner of N");
        _mintNumbers(tokenId);
    }

    function mint(uint256 tokenId) public virtual nonReentrant {
        require(publicSaleActive, "Public sale is not yet active");
        require(tokenId < MAX_TOKEN_ID, "Exceeds total supply");
        _mintNumbers(tokenId);
    }

    function tokenSVG(uint256 tokenId) public view returns (string memory) {
        uint256[8] memory numbers = getNumbers(tokenId);
        string[17] memory parts;
        parts[
        0
        ] = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"><style>.base { fill: white; font-family: serif; font-size: 14px; }</style><rect width="100%" height="100%" fill="black" /><text x="10" y="20" class="base">';

        parts[1] = toString(numbers[0]);

        parts[2] = '</text><text x="10" y="40" class="base">';

        parts[3] = toString(numbers[1]);

        parts[4] = '</text><text x="10" y="60" class="base">';

        parts[5] = toString(numbers[2]);

        parts[6] = '</text><text x="10" y="80" class="base">';

        parts[7] = toString(numbers[3]);

        parts[8] = '</text><text x="10" y="100" class="base">';

        parts[9] = toString(numbers[4]);

        parts[10] = '</text><text x="10" y="120" class="base">';

        parts[11] = toString(numbers[5]);

        parts[12] = '</text><text x="10" y="140" class="base">';

        parts[13] = toString(numbers[6]);

        parts[14] = '</text><text x="10" y="160" class="base">';

        parts[15] = toString(numbers[7]);

        parts[16] = "</text></svg>";

        string memory output = string(
            abi.encodePacked(parts[0], parts[1], parts[2], parts[3], parts[4], parts[5], parts[6], parts[7], parts[8])
        );
        output = string(
            abi.encodePacked(
                output,
                parts[9],
                parts[10],
                parts[11],
                parts[12],
                parts[13],
                parts[14],
                parts[15],
                parts[16]
            )
        );

        return output;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        string memory output;
        if (bytes(_imageUriPrefix).length > 0) {
            output = string(abi.encodePacked(_imageUriPrefix, tokenId.toString(), ".png"));
        } else {
            output = tokenSVG(tokenId);
            output = string(abi.encodePacked(
                    'data:image/svg+xml;base64,',
                    Base64.encode(bytes(output))
                ));
        }

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "The Gaussian Protocol #',
                        toString(tokenId),
                        '", "description": "Randomly generated numbers on-chain with a Gaussian distribution.", "image": "',
                        output,
                        '"}'
                    )
                )
            )
        );
        output = string(abi.encodePacked("data:application/json;base64,", json));

        return output;
    }

    function toString(uint256 value) internal pure returns (string memory) {
        // Inspired by OraclizeAPI's implementation - MIT license
        // https://github.com/oraclize/ethereum-api/blob/b42146b063c7d6ee1358846c198246239e9360e8/oraclizeAPI_0.4.25.sol

        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}

/// [MIT License]
/// @title Base64
/// @notice Provides a function for encoding some bytes in base64
/// @author Brecht Devos <brecht@loopring.org>
library Base64 {
    bytes internal constant TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    /// @notice Encodes some bytes to the base64 representation
    function encode(bytes memory data) internal pure returns (string memory) {
        uint256 len = data.length;
        if (len == 0) return "";

        // multiply by 4/3 rounded up
        uint256 encodedLen = 4 * ((len + 2) / 3);

        // Add some extra buffer at the end
        bytes memory result = new bytes(encodedLen + 32);

        bytes memory table = TABLE;

        assembly {
            let tablePtr := add(table, 1)
            let resultPtr := add(result, 32)

            for {
                let i := 0
            } lt(i, len) {

            } {
                i := add(i, 3)
                let input := and(mload(add(data, i)), 0xffffff)

                let out := mload(add(tablePtr, and(shr(18, input), 0x3F)))
                out := shl(8, out)
                out := add(out, and(mload(add(tablePtr, and(shr(12, input), 0x3F))), 0xFF))
                out := shl(8, out)
                out := add(out, and(mload(add(tablePtr, and(shr(6, input), 0x3F))), 0xFF))
                out := shl(8, out)
                out := add(out, and(mload(add(tablePtr, and(input, 0x3F))), 0xFF))
                out := shl(224, out)

                mstore(resultPtr, out)

                resultPtr := add(resultPtr, 4)
            }

            switch mod(len, 3)
            case 1 {
                mstore(sub(resultPtr, 2), shl(240, 0x3d3d))
            }
            case 2 {
                mstore(sub(resultPtr, 1), shl(248, 0x3d))
            }

            mstore(result, encodedLen)
        }

        return string(result);
    }
}
