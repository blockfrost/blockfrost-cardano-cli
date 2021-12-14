{ pkgs ? import <nixpkgs> { } }:

rec {
  blockfrost-cardano-cli =
    let
      packageJSON = builtins.fromJSON (builtins.readFile ./package.json);
      project = pkgs.callPackage ./yarn-project.nix { nodejs = pkgs.nodejs-14_x; } { src = pkgs.lib.cleanSource ./.; };
    in
    project.overrideAttrs (oldAttrs: rec {
      name = "blockfrost-cardano-cli";
      version = packageJSON.version;
      buildPhase = ''
        yarn pack
        cp -r . $out
        ln -s $out/bin/run $out/bin/${name}
      '';
    });
}
