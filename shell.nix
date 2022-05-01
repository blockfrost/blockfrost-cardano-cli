with import <nixpkgs> {};

stdenv.mkDerivation {
  name = "blockfrost-cardano-cli";
  buildInputs = [
    nodejs-16_x
    (yarn.override { nodejs = nodejs-16_x; })
  ];
  shellHook = ''
    export PATH="$PATH:$(pwd)/node_modules/.bin"
  '';
}
