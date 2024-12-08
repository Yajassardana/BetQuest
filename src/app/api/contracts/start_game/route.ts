import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';
import { db } from '@/config/firebase';
import fs from "fs";
import { CallData, constants, RpcProvider, Contract, Account, json, ec, cairo } from "starknet";


export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
    const providerSepoliaTestnetBlastPublic = new RpcProvider({
        nodeUrl: 'https://starknet-sepolia.public.blastapi.io/rpc/v0_7',
      });
      
      // initialize existing pre-deployed account 0 of Devnet
      const privateKey = '0x02b18cd65caa9e32ef5ab9a23c843395edbe6942c0852d36268d38f9a13b591f';
      const accountAddress = '0x00965f635e14f1b64eb60DC74eF7f418c12EA408451ceCE87d051d32E7d37171';
      
      const account = new Account(providerSepoliaTestnetBlastPublic, accountAddress, privateKey);
      
        const compiledTest = json.parse(fs.readFileSync("/Users/yajas/Developer/Web3/EthIndia2024/bet-quest/src/app/api/target/dev/counter_Game.contract_class.json").toString("ascii"));
      
      console.log("called")
      const myTestContract = new Contract(compiledTest.abi, "0x78b15d18ade2de68f7ab56e704fed1e95c8799c8c47274a97f855e5c63de551", providerSepoliaTestnetBlastPublic);
      console.log('Test Contract connected at =', myTestContract.address);
      let success = await account.execute([
        
        {
            contractAddress: myTestContract.address,
            entrypoint: 'start_game',
            calldata: CallData.compile({
            }),
        }
    ])

    return NextResponse.json({ message: 'User updated successfully' }, { status: 200 });

}