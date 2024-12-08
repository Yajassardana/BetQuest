
import { CallData, constants, RpcProvider, Contract, Account, json, ec, cairo } from "starknet";
import fs from "fs";
import * as dotenv from "dotenv";
import { getCompiledCode } from "./utils";
dotenv.config();


async function main() {
    //initialize Provider 
    const provider = new RpcProvider({
        nodeUrl: process.env.RPC_ENDPOINT,
      });

    // initialize existing Argent X account
    const privateKey0 = process.env.DEPLOYER_PRIVATE_KEY ?? "";
    const accountAddress0: string = process.env.DEPLOYER_ADDRESS ?? "";
    const account0 = new Account(provider, accountAddress0,privateKey0);
    console.log('existing AX account1 connected.\n');


    // Connect the deployed Test instance in devnet
    const testAddress = "0x78b15d18ade2de68f7ab56e704fed1e95c8799c8c47274a97f855e5c63de551"; // modify in accordance with result of script 4
    const compiledTest = json.parse(fs.readFileSync("target/dev/counter_Game.contract_class.json").toString("ascii"));
    const myTestContract = new Contract(compiledTest.abi, testAddress, provider);
    console.log('Test Contract connected at =', myTestContract.address);

    // Interactions with the contract with call & invoke
    myTestContract.connect(account0);
    const par1 = CallData.compile({
        amount: cairo.uint256(1),
    })

    let erc20_address = "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";
    const { abi: testAbi } = await provider.getClassAt(erc20_address);
if (testAbi === undefined) {
  throw new Error('no abi.');
}
const myerc20 = new Contract(testAbi, erc20_address, provider);

    let amount = 1000000000;
    let amount2 = 100


    let success = await account0.execute([
        // {
        //     contractAddress: erc20_address,
        //     entrypoint: 'approve',
        //     calldata: CallData.compile({
        //     recipient : myTestContract.address,
        //     amount: cairo.uint256(amount)	
        //     }),
        // }
        
        {
            contractAddress: myTestContract.address,
            entrypoint: 'deposit',
            calldata: CallData.compile({
            amount: cairo.uint256(amount2)
            
            }),
        }
    ])

    

    
    const res1 = await myTestContract.deposit(par1);
    console.log("res1 =", res1);
 
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });