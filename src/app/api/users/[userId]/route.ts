import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';
import { db } from '@/config/firebase';
import fs from "fs";
import { CallData, constants, RpcProvider, Contract, Account, json, ec, cairo } from "starknet";


export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const userId = (await params).userId;
  console.log(await params)
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const userDocRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userDocRef);
  if (!userDoc.exists()) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  return NextResponse.json(userDoc.data(), { status: 200 });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const userId  = ((await params).userId);
  const { result } = await req.json();
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const userDocRef = doc(db, 'users', userId);
  try {
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
    console.log("User not found", userId)
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const fetchedUserData = userDoc.data();
    if(result == 'win'){
      await updateDoc(userDocRef, { 
        tokens: fetchedUserData.tokens + 50,
        contestsWon: fetchedUserData.contestsWon + 1,
        streak: fetchedUserData.streak + 1,
        previousResults: []
      });
    }
    else{
      await updateDoc(userDocRef, { 
        tokens: fetchedUserData.tokens - 50,
        contestsLost: fetchedUserData.contestsLost + 1,
        streak: 0,
        previousResults: []
      });
    }
    console.log("User updated successfully", userId)
    return NextResponse.json({ message: 'User updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating user', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function POST(
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
        entrypoint: 'deposit',
        calldata: CallData.compile({
        amount: cairo.uint256(100)
        }),
    }
  //   {
  //     contractAddress: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
  //     entrypoint: 'approve',
  //     calldata: CallData.compile({
  //     recipient : myTestContract.address,
  //     amount: cairo.uint256(10000000000)	
  //     }),
  // }
])

  const userId  = ((await params).userId);
  const { tokens } = await req.json();
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const userDocRef = doc(db, 'users', userId);
  try {
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
    console.log("User not found", userId)
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const fetchedUserData = userDoc.data();
      await updateDoc(userDocRef, { 
        tokens: fetchedUserData.tokens + tokens,
      });
    console.log("User updated successfully", userId)
    return NextResponse.json({ message: 'User updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating user', error);
    return NextResponse.json({ message: 'Failed to update user' }, { status: 200 });
  }
}