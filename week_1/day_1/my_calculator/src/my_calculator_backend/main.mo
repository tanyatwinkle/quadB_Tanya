import Debug "mo:base/Debug";
import Float "mo:base/Float"; 
actor {
    public func add(a: Int, b: Int) : async Int {
        return a + b;
    };

    public func subtract(a: Int, b: Int) : async Int {
        return a - b;
    };

    public func multiply(a: Int, b: Int) : async Int {
        return a * b;
    };

        public func divide(a : Int, b : Int) : async ?Float {
        if (b == 0) {
            return null; // Prevent division by zero
        } else {
            return ?(Float.fromInt(a) / Float.fromInt(b));
        }
    };
    
};
