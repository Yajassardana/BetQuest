use starknet::SyscallResultTrait;
use starknet::{Store, SyscallResult,ContractAddress};
use starknet::storage_access::StorageBaseAddress;
use starknet::contract_address_const;

// ANCHOR: StorageAccessImpl
impl StoreContractAddressArray of Store<Array<(ContractAddress,u256)>> {
    fn read(address_domain: u32, base: StorageBaseAddress) -> SyscallResult<Array<(ContractAddress,u256)>> {
        StoreContractAddressArray::read_at_offset(address_domain, base, 0)
    }

    fn write(
        address_domain: u32, base: StorageBaseAddress, value: Array<(ContractAddress,u256)>
    ) -> SyscallResult<()> {
        StoreContractAddressArray::write_at_offset(address_domain, base, 0, value)
    }


    fn read_at_offset(
        address_domain: u32, base: StorageBaseAddress, mut offset: u8
    ) -> SyscallResult<Array<(ContractAddress,u256)>> {
        let mut arr: Array<(ContractAddress,u256)> = array![];

        // Read the stored array's length. If the length is greater than 255, the read will fail.
        let len: u8 = Store::<u8>::read_at_offset(address_domain, base, offset)
            .expect('Storage Span too large');
        offset += 1;

        // Sequentially read all stored elements and append them to the array.
        let exit = len + offset;
        loop {
            if offset >= exit {
                break;
            }

            let value = Store::<(ContractAddress,u256)>::read_at_offset(address_domain, base, offset).unwrap();
            arr.append(value);
            offset += Store::<(ContractAddress,u256)>::size();
        };

        // Return the array.
        Result::Ok(arr)
    }

    fn write_at_offset(
        address_domain: u32, base: StorageBaseAddress, mut offset: u8, mut value: Array<(ContractAddress,u256)>
    ) -> SyscallResult<()> {
        // Store the length of the array in the first storage slot.
        let len: u8 = value.len().try_into().expect('Storage - Span too large');
        Store::<u8>::write_at_offset(address_domain, base, offset, len).unwrap();
        offset += 1;

        // Store the array elements sequentially
        while let Option::Some(element) = value
            .pop_front() {
                Store::<(ContractAddress,u256)>::write_at_offset(address_domain, base, offset, element).unwrap();
                offset += Store::<(ContractAddress,u256)>::size();
            };

        Result::Ok(())
    }

    fn size() -> u8 {
        255 * Store::<(ContractAddress,u256)>::size()
    }
}