import Debug "mo:base/Debug";

actor Counter {
    // Declare a mutable variable to store the counter value
    stable var count : Nat = 0;

    // Function to increment the counter
    public func increment() : async Nat {
        count += 1;
        return count;
    };

    // Function to decrement the counter (ensuring it doesn't go below 0)
    public func decrement() : async Nat {
        if (count > 0) {
            count -= 1;
        };
        return count;
    };

    // Function to get the current counter value
    public query func getCount() : async Nat {
        return count;
    };
}
