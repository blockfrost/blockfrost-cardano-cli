{ pkgs ? import <nixpkgs> { } }:

rec {
  blockfrost-cardano-cli =
    let
    packageJSON = builtins.fromJSON (builtins.readFile ./package.json);
    src = pkgs.lib.cleanSource ./.;
    project = pkgs.callPackage ./yarn-project.nix

    {
      nodejs = pkgs.nodejs-16_x;
    }
    { inherit src; };

    in
    project.overrideAttrs (oldAttrs: rec {
      name = "blockfrost-cardano-cli";
      version = packageJSON.version;
      buildPhase = ''
        yarn build
        cp -r . $out
        ln -s $out/bin/run $out/bin/${name}
      '';
    });
}
