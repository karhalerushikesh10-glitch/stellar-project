#!/bin/bash
set -e

echo "Installing Stellar CLI..."
if ! command -v stellar &> /dev/null
then
    curl -L https://github.com/stellar/stellar-cli/releases/download/v26.0.0/stellar-cli-26.0.0-x86_64-unknown-linux-gnu.tar.gz -o stellar-cli.tar.gz
    tar -xzf stellar-cli.tar.gz
    sudo mv stellar /usr/local/bin/stellar
fi
stellar --version

echo "Setting up Rust toolchain..."
if ! command -v rustup &> /dev/null
then
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source $HOME/.cargo/env
fi
rustup default stable
rustup update stable
rustup target add wasm32-unknown-unknown
rustup target add wasm32v1-none

echo "Setting up alice account..."
if ! stellar keys ls | grep -q alice; then
    stellar keys generate alice --network testnet
    ALICE_ADDR=$(stellar keys address alice)
    curl -s "https://friendbot.stellar.org/?addr=$ALICE_ADDR" > /dev/null
fi
ALICE_ADDR=$(stellar keys address alice)

echo "Building and deploying Counter..."
cd contracts/counter
stellar contract build
COUNTER_WASM_HASH=$(stellar contract upload --network testnet --source-account alice --wasm target/wasm32v1-none/release/counter.wasm | sed -r 's/\x1B\[[0-9;]*[a-zA-Z]//g' | grep -o '[0-9a-f]\{64\}')
COUNTER_ID=$(stellar contract deploy --wasm-hash $COUNTER_WASM_HASH --source-account alice --network testnet --alias counter | sed -r 's/\x1B\[[0-9;]*[a-zA-Z]//g' | grep -o 'C[A-Z0-9]\{55\}')
echo "Initializing Counter..."
stellar contract invoke --id $COUNTER_ID --source-account alice --network testnet -- initialize --owner $ALICE_ADDR > /dev/null

echo "Building and deploying Reward..."
cd ../reward
stellar contract build
REWARD_WASM_HASH=$(stellar contract upload --network testnet --source-account alice --wasm target/wasm32v1-none/release/reward.wasm | sed -r 's/\x1B\[[0-9;]*[a-zA-Z]//g' | grep -o '[0-9a-f]\{64\}')
REWARD_ID=$(stellar contract deploy --wasm-hash $REWARD_WASM_HASH --source-account alice --network testnet --alias reward | sed -r 's/\x1B\[[0-9;]*[a-zA-Z]//g' | grep -o 'C[A-Z0-9]\{55\}')

echo "Building and deploying Payment Splitter..."
cd ../payment_splitter
stellar contract build
SPLITTER_WASM_HASH=$(stellar contract upload --network testnet --source-account alice --wasm target/wasm32v1-none/release/payment_splitter.wasm | sed -r 's/\x1B\[[0-9;]*[a-zA-Z]//g' | grep -o '[0-9a-f]\{64\}')
SPLITTER_ID=$(stellar contract deploy --wasm-hash $SPLITTER_WASM_HASH --source-account alice --network testnet --alias payment_splitter | sed -r 's/\x1B\[[0-9;]*[a-zA-Z]//g' | grep -o 'C[A-Z0-9]\{55\}')

echo "Initializing Splitter..."
stellar contract invoke --id $SPLITTER_ID --source-account alice --network testnet -- initialize --admin $ALICE_ADDR > /dev/null

echo "Deploying SDT Token..."
cd ../../
SDT_ID=$(stellar contract asset deploy --asset SDT:$ALICE_ADDR --source-account alice --network testnet | sed -r 's/\x1B\[[0-9;]*[a-zA-Z]//g' | grep -o 'C[A-Z0-9]\{55\}')

echo "Initializing Reward..."
stellar contract invoke --id $REWARD_ID --source-account alice --network testnet -- initialize --admin $ALICE_ADDR --reward_token $SDT_ID > /dev/null

echo "=================================================="
echo "DEPLOYMENT COMPLETE — COPY THESE VALUES"
echo "=================================================="
echo "COUNTER_ADDRESS=$COUNTER_ID"
echo "REWARD_ADDRESS=$REWARD_ID"
echo "SPLITTER_ADDRESS=$SPLITTER_ID"
echo "SDT_ADDRESS=$SDT_ID"
echo "=================================================="

cat <<EOF > deployed-addresses.txt
COUNTER_ADDRESS=$COUNTER_ID
REWARD_ADDRESS=$REWARD_ID
SPLITTER_ADDRESS=$SPLITTER_ID
SDT_ADDRESS=$SDT_ID
EOF
