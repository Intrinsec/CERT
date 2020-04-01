import struct, sys

seed = 0x0309

def c_rand_function():
    # reimplementation de la fonction rand
    global seed
    seed = 214013 * seed + 2531011
    return (seed >> 16) & 0x7fff

def extract(filename): 
    # Ouverture du fichier
    f = open(filename, 'rb')
    # extraction de la taille de la section DATA
    f.seek(40, 0)
    sizeb = f.read(4)
    size = struct.unpack("<L", sizeb)[0]

    # extraction de la section data
    extracted_data = list()
    counter = 15
    for i in range(0, size, counter):
        extracted_data.append(f.read(1))
        f.seek(counter, 1)
    f.close()
    return extracted_data

def process_decode(encoded):
    # decodage avec la fonction rand utilisee en C
    decoded = list()
    for i in encoded:
        decoded.append((struct.unpack("<B", i)[0] if i else 0x00) - c_rand_function() % 256)
    return decoded

def decode(filename):
    encoded = extract(filename)
    return process_decode(encoded) 

def write(filename, decoded):
    f = open(filename, "wb")
    for i in decoded :
        f.write(struct.pack('i', i)[0].to_bytes(1, byteorder="little"))
    f.close()

def main():
    if len(sys.argv) < 3 :
        print('Usage :')
        print('python decoder.py encoded_file.wav output.bin')
        exit()
    print('Utilisation du fichier {0}'.format(sys.argv[1]))
    decoded = decode(sys.argv[1])
    print('Ecriture du fichier {0}'.format(sys.argv[2]))
    write(sys.argv[2], decoded)
    
main()