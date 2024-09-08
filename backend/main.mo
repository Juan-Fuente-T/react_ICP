import List "mo:base/List";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
actor {
    var names : List.List<Text> = List.nil();

    type AddNameResult = Result.Result<(), Text>;

    public shared ({ caller }) func addName(name : Text) : async AddNameResult {
        if (Principal.isAnonymous(caller)) return #err("You must be authenticated to add a name");

        names := List.push<Text>(name, names);

        return #ok();
    };

    type RemoveNameResult = Result.Result<(), Text>;

    public shared ({ caller }) func removeName(name : Text) : async RemoveNameResult {
        if (Principal.isAnonymous(caller)) return #err("You must be authenticated to remove a name");

        let originalLength = List.size(names);
        names := List.filter(names, func(n : Text) : Bool { n != name });

        if (List.size(names) == originalLength) {
            return #err("Name not found");
        };

        return #ok();
    };

    type GetNamesResult = Result.Result<[Text], Text>;

    public shared query ({ caller }) func getNames() : async GetNamesResult {
        if (Principal.isAnonymous(caller)) return #err("You must be authenticated to get the name's list");

        return #ok(List.toArray(names));
    };
};
