#[starknet::interface]
pub trait IGame<TContractState> {
    fn claimPoints (ref self: TContractState, _points: u256);
    fn deposit(ref self: TContractState, amount: u256);
    fn withdraw(ref self: TContractState, amount: u256);
    fn start_game(ref self: TContractState);
    fn play_game(ref self: TContractState, stake_amount: u256, choice: u256);
    fn settle_game(ref self: TContractState, right_option: u256);
}



#[starknet::contract]
pub mod Game {

    use super::{IGame};
    use starknet::{ContractAddress, get_caller_address, get_contract_address};

    use counter::erc20_interface::{IERC20Dispatcher, IERC20DispatcherTrait};

    #[constructor]
    fn constructor(ref self: ContractState, _token_addr: ContractAddress) {
        self.token_address.write(_token_addr);
        self.game_in_progress.write(false);
    }

    #[storage]
    struct Storage {
        token_address: ContractAddress,
        balances: LegacyMap::<ContractAddress, u256>,
        players : LegacyMap::<u256,(ContractAddress, u256)>,
        game_in_progress: bool,
        counter: u256
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        RewardCliamed: RewardCliamed
    }

    #[derive(Drop, starknet::Event)]
    struct RewardCliamed {
        player: ContractAddress,
        amount: u256
    }

    #[abi(embed_v0)]
    impl GameImpl of IGame<ContractState> {
        fn claimPoints (ref self: ContractState, _points: u256) {
            let caller = get_caller_address();

            let strk_erc20_contract = IERC20Dispatcher {
                contract_address: self.token_address.read()
            };

            strk_erc20_contract.transfer(caller, _points);

            self.emit( RewardCliamed {player: caller, amount: _points});
        }

        fn deposit(ref self: ContractState, amount: u256) {
            let caller = get_caller_address();

            let strk_erc20_contract = IERC20Dispatcher {
                contract_address: self.token_address.read()
            };

            strk_erc20_contract.transfer_from(caller, get_contract_address(), amount);

            let balance = self.balances.read(caller);
            self.balances.write(caller, balance + amount);
        }

        fn withdraw(ref self: ContractState, amount: u256) {
            let caller = get_caller_address();

            let balance = self.balances.read(caller);
            assert!(balance >= amount, "Insufficient balance");

            let strk_erc20_contract = IERC20Dispatcher {
                contract_address: self.token_address.read()
            };

            strk_erc20_contract.transfer(caller, amount);

            self.balances.write(caller, balance - amount);
        }

        fn start_game(ref self: ContractState) {
            self.game_in_progress.write(true);
        }

        fn play_game(ref self: ContractState, stake_amount: u256, choice: u256) {
            let caller = get_caller_address();

            let balance = self.balances.read(caller);
            assert!(balance >= stake_amount, "Insufficient balance");
            assert!(self.game_in_progress.read(), "No game in progress");

            let counter_example = self.counter.read();
            self.counter.write(counter_example + 1);
            self.players.write(counter_example, (caller, stake_amount));

        }

        fn settle_game(ref self: ContractState, right_option: u256) {
            let reward_amount = 5; // Set reward amount

            let counter_example = self.counter.read();
            let mut i = 0;
            loop {
                if i >= counter_example {
                    break;
                }

                let (player, stake_amount) = self.players.read(i);
                if i == right_option {
                    self.claimPoints(reward_amount);
                }

                i += 1;
            };

            self.game_in_progress.write(false);
        }
    }   
}
